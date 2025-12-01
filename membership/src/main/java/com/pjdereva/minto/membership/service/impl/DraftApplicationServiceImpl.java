package com.pjdereva.minto.membership.service.impl;

import com.pjdereva.minto.membership.dto.application.*;
import com.pjdereva.minto.membership.model.*;
import com.pjdereva.minto.membership.model.transaction.*;
import com.pjdereva.minto.membership.repository.*;
import com.pjdereva.minto.membership.service.DraftApplicationService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DraftApplicationServiceImpl implements DraftApplicationService {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final PersonRepository personRepository;
    //private final ContactRepository contactRepository;
    private final AddressRepository addressRepository;
    private final EmailRepository emailRepository;
    private final PhoneRepository phoneRepository;

    /**
     * Save or update application draft
     * This method handles deduplication of all related entities
     */
    @Transactional
    @Override
    public Application saveDraft(User user, ApplicationDTO draft) {
        Application application;

        // Get existing draft or create new one
        if (draft.getApplicationId() != null) {
            application = applicationRepository.findById(draft.getApplicationId())
                    .orElseThrow(() -> new RuntimeException("Application not found"));

            // Verify ownership
            if (!application.getUser().getId().equals(user.getId())) {
                throw new SecurityException("User does not own this application");
            }

            // Verify it's still editable
            if (!application.isEditable()) {
                throw new IllegalStateException("Application cannot be edited");
            }

            log.info("Updating existing draft application: {}", application.getApplicationNumber());
        } else {
            // Create new application
            application = applicationRepository.findByUserIdAndApplicationStatus(
                    user.getId(), ApplicationStatus.DRAFT
            ).orElseGet(() -> {
                Application newApp = Application.builder()
                        .applicationNumber(generateApplicationNumber())
                        .applicationStatus(ApplicationStatus.DRAFT)
                        .notes("Created by user: " + user.getEmail())
                        .build();
                newApp.setUser(user);
                newApp.setPerson(user.getPerson());
                //newApp = applicationRepository.save(newApp);
                return newApp;
            });

            log.info("Creating new draft application");
        }

        // Update basic application info
        application.setMaritalStatus(draft.getMaritalStatus());
        application.setNotes(draft.getNotes());

        // TODO: Update person info with deduplication
        updatePersonalInfo(user.getPerson().getId(), draft.getPerson());

        // Update family members with deduplication
        updateParents(application, draft.getParents());
        updateSpouses(application, draft.getSpouses());
        updateChildren(application, draft.getChildren());
        updateSiblings(application, draft.getSiblings());
        updateRelatives(application, draft.getRelatives());
        updateBeneficiaries(application, draft.getBeneficiaries());
        updateReferees(application, draft.getReferees());

        //user.addApplication(application);
        application = applicationRepository.save(application);

        log.info("Draft saved successfully: {}", application.getApplicationNumber());
        return application;
    }

    /**
     * Load draft application for editing
     */
    @Transactional
    @Override
    public ApplicationDTO loadDraft(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<Application> draftOpt = applicationRepository
                .findByUserIdAndApplicationStatus(userId, ApplicationStatus.DRAFT);

        if (draftOpt.isEmpty()) {
            // Return empty draft
            return new ApplicationDTO();
        }

        Application application = applicationRepository
                .findByIdWithFamily(draftOpt.get().getId())
                .orElseThrow();

        // Convert to Request
        ApplicationDTO draft = new ApplicationDTO();
        draft.setApplicationId(application.getId());
        draft.setApplicationNumber(application.getApplicationNumber());
        draft.setMaritalStatus(application.getMaritalStatus());
        draft.setNotes(application.getNotes());

        // Convert family members to Requests
        draft.setParents(application.getParents().stream()
                .map(this::convertToParentRequest)
                .collect(Collectors.toList()));

        draft.setSpouses(application.getSpouses().stream()
                .map(this::convertToSpouseRequest)
                .collect(Collectors.toList()));

        draft.setChildren(application.getChildren().stream()
                .map(this::convertToChildRequest)
                .collect(Collectors.toList()));

        draft.setSiblings(application.getSiblings().stream()
                .map(this::convertToSiblingRequest)
                .collect(Collectors.toList()));

        draft.setRelatives(application.getRelatives().stream()
                .map(this::convertToRelativeRequest)
                .collect(Collectors.toList()));

        draft.setBeneficiaries(application.getBeneficiaries().stream()
                .map(this::convertToBeneficiaryRequest)
                .collect(Collectors.toList()));

        draft.setReferees(application.getReferees().stream()
                .map(this::convertToRefereeRequest)
                .collect(Collectors.toList()));

        log.info("Draft loaded: {}", application.getApplicationNumber());
        return draft;
    }

    /**
     * Delete draft application
     */
    @Transactional
    @Override
    public void deleteDraft(Long userId) {
        Optional<Application> draftOpt = applicationRepository
                .findByUserIdAndApplicationStatus(userId, ApplicationStatus.DRAFT);

        if (draftOpt.isPresent()) {
            Application draft = draftOpt.get();

            // Verify ownership
            if (!draft.getUser().getId().equals(userId)) {
                throw new SecurityException("User does not own this application");
            }

            applicationRepository.delete(draft);
            log.info("Draft deleted: {}", draft.getApplicationNumber());
        }
    }

    // ========================================================================
    // DEDUPLICATION METHODS - Key to preventing duplicates
    // ========================================================================

    private void updatePersonalInfo(Long personId, PersonDTO data) {
        if (data == null) return;

        Optional<Person> personOpt = personRepository.findById(personId);
        if(personOpt.isPresent()) {
            Person person = personOpt.get();
            person.setFirstName(data.getFirstName());
            person.setLastName(data.getLastName());
            person.setMiddleName(data.getMiddleName());
            person.setDob(data.getDob());
            person.setLifeStatus(data.getLifeStatus());

            // Update or create contact
            if (data.getContact() != null) {
                Contact contact = person.getContact();
                if (contact == null) {
                    log.debug("Person -> Contact is NULL");
                    contact = new Contact();
                    person.setContact(contact);
                }

                // Update addresses
                updateContactAddresses(contact, data.getContact().getAddresses());
                // Update email
                updateContactEmails(contact, data.getContact().getEmails());
                // Update phone
                updateContactPhones(contact, data.getContact().getPhones());
            } else {
                log.debug("PersonDTO -> Contact is NULL");
            }
        }
    }

    private void updateParents(Application application, List<ParentDTO> draftParents) {
        if (draftParents == null) return;

        // Get existing parents mapped by ID (if they have one)
        Map<Long, Parent> existingMap = application.getParents().stream()
                .filter(p -> p.getId() != null)
                .collect(Collectors.toMap(Parent::getId, p -> p));

        // Track which existing parents to keep
        Set<Long> idsToKeep = new HashSet<>();

        // Process draft parents
        for (ParentDTO dto : draftParents) {
            if (dto.getParentId() != null && existingMap.containsKey(dto.getParentId())) {
                // UPDATE existing parent
                Parent existing = existingMap.get(dto.getParentId());
                updateParentFromRequest(existing, dto);
                idsToKeep.add(dto.getParentId());
            } else {
                // CREATE new parent
                Parent newParent = createParentFromRequest(dto);
                application.addParent(newParent);
            }
        }

        // REMOVE parents not in the draft (user deleted them)
        Set<Parent> toRemove = application.getParents().stream()
                .filter(p -> p.getId() != null && !idsToKeep.contains(p.getId()))
                .collect(Collectors.toSet());

        toRemove.forEach(application::removeParent);

        log.debug("Parents updated: {} kept, {} added, {} removed",
                idsToKeep.size(),
                draftParents.size() - idsToKeep.size(),
                toRemove.size());
    }

    private void updateSpouses(Application application, List<SpouseDTO> draftSpouses) {
        if (draftSpouses == null) return;

        Map<Long, Spouse> existingMap = application.getSpouses().stream()
                .filter(s -> s.getId() != null)
                .collect(Collectors.toMap(Spouse::getId, s -> s));

        Set<Long> idsToKeep = new HashSet<>();

        for (SpouseDTO dto : draftSpouses) {
            if (dto.getSpouseId() != null && existingMap.containsKey(dto.getSpouseId())) {
                Spouse existing = existingMap.get(dto.getSpouseId());
                updateSpouseFromRequest(existing, dto);
                idsToKeep.add(dto.getSpouseId());
            } else {
                Spouse newSpouse = createSpouseFromRequest(dto);
                application.addSpouse(newSpouse);
            }
        }

        Set<Spouse> toRemove = application.getSpouses().stream()
                .filter(s -> s.getId() != null && !idsToKeep.contains(s.getId()))
                .collect(Collectors.toSet());

        toRemove.forEach(application::removeSpouse);
    }

    private void updateChildren(Application application, List<ChildDTO> draftChildren) {
        if (draftChildren == null) return;

        Map<Long, Child> existingMap = application.getChildren().stream()
                .filter(c -> c.getId() != null)
                .collect(Collectors.toMap(Child::getId, c -> c));

        Set<Long> idsToKeep = new HashSet<>();

        for (ChildDTO dto : draftChildren) {
            if (dto.getChildId() != null && existingMap.containsKey(dto.getChildId())) {
                Child existing = existingMap.get(dto.getChildId());
                updateChildFromRequest(existing, dto);
                idsToKeep.add(dto.getChildId());
            } else {
                Child newChild = createChildFromRequest(dto);
                application.addChild(newChild);
            }
        }

        Set<Child> toRemove = application.getChildren().stream()
                .filter(c -> c.getId() != null && !idsToKeep.contains(c.getId()))
                .collect(Collectors.toSet());

        toRemove.forEach(application::removeChild);
    }

    private void updateSiblings(Application application, List<SiblingDTO> draftSiblings) {
        if (draftSiblings == null) return;

        Map<Long, Sibling> existingMap = application.getSiblings().stream()
                .filter(s -> s.getId() != null)
                .collect(Collectors.toMap(Sibling::getId, s -> s));

        Set<Long> idsToKeep = new HashSet<>();

        for (SiblingDTO dto : draftSiblings) {
            if (dto.getSiblingId() != null && existingMap.containsKey(dto.getSiblingId())) {
                Sibling existing = existingMap.get(dto.getSiblingId());
                updateSiblingFromRequest(existing, dto);
                idsToKeep.add(dto.getSiblingId());
            } else {
                Sibling newSibling = createSiblingFromRequest(dto);
                application.addSibling(newSibling);
            }
        }

        Set<Sibling> toRemove = application.getSiblings().stream()
                .filter(s -> s.getId() != null && !idsToKeep.contains(s.getId()))
                .collect(Collectors.toSet());

        toRemove.forEach(application::removeSibling);
    }

    private void updateRelatives(Application application, List<RelativeDTO> draftRelatives) {
        if (draftRelatives == null) return;

        Map<Long, Relative> existingMap = application.getRelatives().stream()
                .filter(r -> r.getId() != null)
                .collect(Collectors.toMap(Relative::getId, r -> r));

        Set<Long> idsToKeep = new HashSet<>();

        for (RelativeDTO dto : draftRelatives) {
            if (dto.getRelativeId() != null && existingMap.containsKey(dto.getRelativeId())) {
                Relative existing = existingMap.get(dto.getRelativeId());
                updateRelativeFromRequest(existing, dto);
                idsToKeep.add(dto.getRelativeId());
            } else {
                Relative newRelative = createRelativeFromRequest(dto);
                application.addRelative(newRelative);
            }
        }

        Set<Relative> toRemove = application.getRelatives().stream()
                .filter(r -> r.getId() != null && !idsToKeep.contains(r.getId()))
                .collect(Collectors.toSet());

        toRemove.forEach(application::removeRelative);
    }

    private void updateBeneficiaries(Application application, List<BeneficiaryDTO> draftBeneficiaries) {
        if (draftBeneficiaries == null) return;

        Map<Long, Beneficiary> existingMap = application.getBeneficiaries().stream()
                .filter(b -> b.getId() != null)
                .collect(Collectors.toMap(Beneficiary::getId, b -> b));

        Set<Long> idsToKeep = new HashSet<>();

        for (BeneficiaryDTO dto : draftBeneficiaries) {
            if (dto.getBeneficiaryId() != null && existingMap.containsKey(dto.getBeneficiaryId())) {
                Beneficiary existing = existingMap.get(dto.getBeneficiaryId());
                updateBeneficiaryFromRequest(existing, dto);
                idsToKeep.add(dto.getBeneficiaryId());
            } else {
                Beneficiary newBeneficiary = createBeneficiaryFromRequest(dto);
                application.addBeneficiary(newBeneficiary);
            }
        }

        Set<Beneficiary> toRemove = application.getBeneficiaries().stream()
                .filter(b -> b.getId() != null && !idsToKeep.contains(b.getId()))
                .collect(Collectors.toSet());

        toRemove.forEach(application::removeBeneficiary);
    }

    private void updateReferees(Application application, List<RefereeDTO> draftReferees) {
        if (draftReferees == null) return;

        Map<Long, Referee> existingMap = application.getReferees().stream()
                .filter(r -> r.getId() != null)
                .collect(Collectors.toMap(Referee::getId, r -> r));

        Set<Long> idsToKeep = new HashSet<>();

        for (RefereeDTO dto : draftReferees) {
            if (dto.getRefereeId() != null && existingMap.containsKey(dto.getRefereeId())) {
                Referee existing = existingMap.get(dto.getRefereeId());
                updateRefereeFromRequest(existing, dto);
                idsToKeep.add(dto.getRefereeId());
            } else {
                Referee newReferee = createRefereeFromRequest(dto);
                application.addReferee(newReferee);
            }
        }

        Set<Referee> toRemove = application.getReferees().stream()
                .filter(r -> r.getId() != null && !idsToKeep.contains(r.getId()))
                .collect(Collectors.toSet());

        toRemove.forEach(application::removeReferee);
    }

    // ========================================================================
    // ENTITY CREATION & UPDATE METHODS
    // ========================================================================

    private Parent createParentFromRequest(ParentDTO dto) {
        Person person = createOrUpdatePerson(dto);

        return Parent.builder()
                .person(person)
                .parentType(dto.getParentType())
                .notes(dto.getNotes())
                .build();
    }

    private void updateParentFromRequest(Parent parent, ParentDTO dto) {
        // Update person data
        updatePersonFromRequest(parent.getPerson(), dto);

        // Update parent-specific fields
        parent.setParentType(dto.getParentType());
        parent.setNotes(dto.getNotes());
    }

    private Spouse createSpouseFromRequest(SpouseDTO dto) {
        Person person = createOrUpdatePerson(dto);

        return Spouse.builder()
                .person(person)
                .maritalStatus(dto.getMaritalStatus())
                .notes(dto.getNotes())
                .build();
    }

    private void updateSpouseFromRequest(Spouse spouse, SpouseDTO dto) {
        updatePersonFromRequest(spouse.getPerson(), dto);
        spouse.setMaritalStatus(dto.getMaritalStatus());
        spouse.setNotes(dto.getNotes());
    }

    private Child createChildFromRequest(ChildDTO dto) {
        Person person = createOrUpdatePerson(dto);

        return Child.builder()
                .person(person)
                .childType(dto.getChildType())
                .notes(dto.getNotes())
                .build();
    }

    private void updateChildFromRequest(Child child, ChildDTO dto) {
        updatePersonFromRequest(child.getPerson(), dto);
        child.setChildType(dto.getChildType());
        child.setNotes(dto.getNotes());
    }

    private Sibling createSiblingFromRequest(SiblingDTO dto) {
        Person person = createOrUpdatePerson(dto);

        return Sibling.builder()
                .person(person)
                .siblingType(dto.getSiblingType())
                .notes(dto.getNotes())
                .build();
    }

    private void updateSiblingFromRequest(Sibling sibling, SiblingDTO dto) {
        updatePersonFromRequest(sibling.getPerson(), dto);
        sibling.setSiblingType(dto.getSiblingType());
        sibling.setNotes(dto.getNotes());
    }

    private Relative createRelativeFromRequest(RelativeDTO dto) {
        Person person = createOrUpdatePerson(dto);

        return Relative.builder()
                .person(person)
                .familyRelationship(dto.getRelationship())
                .membershipNumber(dto.getMembershipNumber())
                .notes(dto.getNotes())
                .build();
    }

    private void updateRelativeFromRequest(Relative relative, RelativeDTO dto) {
        updatePersonFromRequest(relative.getPerson(), dto);
        relative.setFamilyRelationship(dto.getRelationship());
        relative.setMembershipNumber(dto.getMembershipNumber());
        relative.setNotes(dto.getNotes());
    }

    private Beneficiary createBeneficiaryFromRequest(BeneficiaryDTO dto) {
        Person person = createOrUpdatePerson(dto);

        return Beneficiary.builder()
                .person(person)
                .percentage(dto.getPercentage())
                .relationship(dto.getRelationship())
                .notes(dto.getNotes())
                .build();
    }

    private void updateBeneficiaryFromRequest(Beneficiary beneficiary, BeneficiaryDTO dto) {
        updatePersonFromRequest(beneficiary.getPerson(), dto);
        beneficiary.setPercentage(dto.getPercentage());
        beneficiary.setRelationship(dto.getRelationship());
        beneficiary.setNotes(dto.getNotes());
    }

    private Referee createRefereeFromRequest(RefereeDTO dto) {
        Person person = createOrUpdatePerson(dto);

        return Referee.builder()
                .person(person)
                .membershipNumber(dto.getMembershipNumber())
                .comments(dto.getComments())
                .notes(dto.getNotes())
                .build();
    }

    private void updateRefereeFromRequest(Referee referee, RefereeDTO dto) {
        updatePersonFromRequest(referee.getPerson(), dto);
        referee.setMembershipNumber(dto.getMembershipNumber());
        referee.setComments(dto.getComments());
        referee.setNotes(dto.getNotes());
    }

    // ========================================================================
    // PERSON & CONTACT MANAGEMENT - Critical for avoiding duplicates
    // ========================================================================

    /**
     * Create or update person - prevents duplicate person records
     */
    private Person createOrUpdatePerson(PersonDTO request) {

        Person person;

        if (request.getPersonId() != null) {
            // UPDATE existing person
            person = personRepository.findById(request.getPersonId())
                    .orElseThrow(() -> new RuntimeException("Person not found: " + request.getPersonId()));
        } else {
            // CREATE new person
            person = new Person();
            person.setLifeStatus(LifeStatus.LIVING);
        }

        updatePersonFromRequest(person, request);

        return person;
    }

    /**
     * Update person fields from DTO
     */
    private void updatePersonFromRequest(Person person, PersonDTO data) {
        if (data == null) return;

        person.setFirstName(data.getFirstName());
        person.setLastName(data.getLastName());
        person.setMiddleName(data.getMiddleName());
        person.setDob(data.getDob());
        person.setLifeStatus(data.getLifeStatus());

        // Update or create contact
        if (data.getContact() != null) {
            Contact contact = person.getContact();
            if (contact == null) {
                log.debug("Person({} {}) -> Contact is NULL", person.getFirstName(), person.getLastName());
                contact = new Contact();
                person.setContact(contact);
            }

            // Update addresses
            updateContactAddresses(contact, data.getContact().getAddresses());
            // Update email
            updateContactEmails(contact, data.getContact().getEmails());

            // Update phone
            updateContactPhones(contact, data.getContact().getPhones());
        } else {
            log.debug("PersonDTO({} {}) -> Contact is NULL", data.getFirstName(), data.getLastName());
        }
    }
    private void updateContactAddresses(Contact contact, List<AddressDTO> addressDTOS) {
        if (!(addressDTOS.isEmpty())) {
            addressDTOS.forEach(addressDTO -> {
                if (addressDTO.getAddressId() == null) {
                    Address address = Address.builder()
                            .addressType(addressDTO.getType())
                            .street(addressDTO.getStreet())
                            .city(addressDTO.getCity())
                            .state(addressDTO.getState())
                            .zipcode(addressDTO.getZipcode())
                            .country(addressDTO.getCountry())
                            .build();
                    contact.addAddress(address);
                } else {
                    Address existingAddress = addressRepository.findById(addressDTO.getAddressId())
                            .orElseThrow(() -> new EntityNotFoundException("Address with ID " + addressDTO.getAddressId() + " not found"));

                    existingAddress.setAddressType(addressDTO.getType());
                    existingAddress.setStreet(addressDTO.getStreet());
                    existingAddress.setCity(addressDTO.getCity());
                    existingAddress.setState(addressDTO.getState());
                    existingAddress.setZipcode(addressDTO.getZipcode());
                    existingAddress.setCountry(addressDTO.getCountry());
                }
            });
        }
        //contact.setAddresses(addressDTOS);
    }

    /**
     * Update contact email - prevents duplicate email records
     */
    private void updateContactEmails(Contact contact, List<EmailDTO> emailDTOS) {
        if (!(emailDTOS.isEmpty())) {
            emailDTOS.forEach(emailDTO -> {
                if (emailDTO.getEmailId() == null) {
                    Email email = Email.builder()
                            .emailType(emailDTO.getType())
                            .address(emailDTO.getAddress())
                            .build();
                    contact.addEmail(email);
                } else {
                    Email existingEmail = emailRepository.findById(emailDTO.getEmailId())
                            .orElseThrow(() -> new EntityNotFoundException("Email with Id: " + emailDTO.getEmailId() + " not found"));

                    existingEmail.setEmailType(emailDTO.getType());
                    existingEmail.setAddress(emailDTO.getAddress());
                }
            });
        }
    }

    /**
     * Update contact phone - prevents duplicate phone records
     */
    private void updateContactPhones(Contact contact, List<PhoneDTO> phoneDTOS) {
        if (!(phoneDTOS.isEmpty())) {
            phoneDTOS.forEach(phoneDTO -> {
                if (phoneDTO.getPhoneId() == null) {
                    Phone phone = Phone.builder()
                            .phoneType(phoneDTO.getType())
                            .number(phoneDTO.getNumber())
                            .countryCode(phoneDTO.getCountryCode())
                            .build();
                    contact.addPhone(phone);
                } else {
                    Phone existingPhone = phoneRepository.findById(phoneDTO.getPhoneId())
                            .orElseThrow(() -> new EntityNotFoundException("Phone with Id: " + phoneDTO.getPhoneId() + " not found"));

                    existingPhone.setPhoneType(phoneDTO.getType());
                    existingPhone.setNumber(phoneDTO.getNumber());
                    existingPhone.setCountryCode(phoneDTO.getCountryCode());
                }
            });
        }
    }

    // ========================================================================
    // REQUEST CONVERSION METHODS
    // ========================================================================

    private ParentDTO convertToParentRequest(Parent parent) {
        ParentDTO request = new ParentDTO();
        request.setParentId(parent.getId());
        request.setFirstName(parent.getPerson().getFirstName());
        request.setLastName(parent.getPerson().getLastName());
        request.setMiddleName(parent.getPerson().getMiddleName());
        request.setDob(parent.getPerson().getDob());
        request.setLifeStatus(parent.getPerson().getLifeStatus());
        request.setContact(convertToContactRequest(parent.getPerson().getContact()));
        request.setParentType(parent.getParentType());
        request.setNotes(parent.getNotes());
        return request;
    }

    private SpouseDTO convertToSpouseRequest(Spouse spouse) {
        SpouseDTO request = new SpouseDTO();
        request.setSpouseId(spouse.getId());
        request.setFirstName(spouse.getPerson().getFirstName());
        request.setLastName(spouse.getPerson().getLastName());
        request.setMiddleName(spouse.getPerson().getMiddleName());
        request.setDob(spouse.getPerson().getDob());
        request.setLifeStatus(spouse.getPerson().getLifeStatus());
        request.setContact(convertToContactRequest(spouse.getPerson().getContact()));
        request.setMaritalStatus(spouse.getMaritalStatus());
        request.setNotes(spouse.getNotes());
        return request;
    }

    private ChildDTO convertToChildRequest(Child child) {
        ChildDTO request = new ChildDTO();
        request.setChildId(child.getId());
        request.setFirstName(child.getPerson().getFirstName());
        request.setLastName(child.getPerson().getLastName());
        request.setMiddleName(child.getPerson().getMiddleName());
        request.setDob(child.getPerson().getDob());
        request.setLifeStatus(child.getPerson().getLifeStatus());
        request.setContact(convertToContactRequest(child.getPerson().getContact()));
        request.setChildType(child.getChildType());
        request.setNotes(child.getNotes());
        return request;
    }

    private SiblingDTO convertToSiblingRequest(Sibling sibling) {
        SiblingDTO request = new SiblingDTO();
        request.setSiblingId(sibling.getId());
        request.setFirstName(sibling.getPerson().getFirstName());
        request.setLastName(sibling.getPerson().getLastName());
        request.setMiddleName(sibling.getPerson().getMiddleName());
        request.setDob(sibling.getPerson().getDob());
        request.setLifeStatus(sibling.getPerson().getLifeStatus());
        request.setContact(convertToContactRequest(sibling.getPerson().getContact()));
        request.setSiblingType(sibling.getSiblingType());
        request.setNotes(sibling.getNotes());
        return request;
    }

    private RelativeDTO convertToRelativeRequest(Relative relative) {
        RelativeDTO request = new RelativeDTO();
        request.setRelativeId(relative.getId());
        request.setFirstName(relative.getPerson().getFirstName());
        request.setLastName(relative.getPerson().getLastName());
        request.setMiddleName(relative.getPerson().getMiddleName());
        request.setDob(relative.getPerson().getDob());
        request.setLifeStatus(relative.getPerson().getLifeStatus());
        request.setContact(convertToContactRequest(relative.getPerson().getContact()));
        request.setRelationship(relative.getFamilyRelationship());
        request.setMembershipNumber(relative.getMembershipNumber());
        request.setNotes(relative.getNotes());
        return request;
    }

    private BeneficiaryDTO convertToBeneficiaryRequest(Beneficiary beneficiary) {
        BeneficiaryDTO request = new BeneficiaryDTO();
        request.setBeneficiaryId(beneficiary.getId());
        request.setFirstName(beneficiary.getPerson().getFirstName());
        request.setLastName(beneficiary.getPerson().getLastName());
        request.setMiddleName(beneficiary.getPerson().getMiddleName());
        request.setDob(beneficiary.getPerson().getDob());
        request.setLifeStatus(beneficiary.getPerson().getLifeStatus());
        request.setContact(convertToContactRequest(beneficiary.getPerson().getContact()));
        request.setPercentage(beneficiary.getPercentage());
        request.setRelationship(beneficiary.getRelationship());
        request.setNotes(beneficiary.getNotes());
        return request;
    }

    private RefereeDTO convertToRefereeRequest(Referee referee) {
        RefereeDTO request = new RefereeDTO();
        request.setRefereeId(referee.getId());
        request.setFirstName(referee.getPerson().getFirstName());
        request.setLastName(referee.getPerson().getLastName());
        request.setMiddleName(referee.getPerson().getMiddleName());
        request.setDob(referee.getPerson().getDob());
        request.setLifeStatus(referee.getPerson().getLifeStatus());
        request.setContact(convertToContactRequest(referee.getPerson().getContact()));
        request.setMembershipNumber(referee.getMembershipNumber());
        request.setComments(referee.getComments());
        request.setNotes(referee.getNotes());
        return request;
    }

    private ContactDTO convertToContactRequest(Contact contact) {
        ContactDTO request = null;

        if (contact != null) {
            log.debug("Create ContactDTO id: {}", contact.getId());
            request = new ContactDTO();
            request.setContactId(contact.getId());

            if (!(contact.getAddresses().isEmpty())) {
                List<AddressDTO> addressDTOS = new ArrayList<>();
                contact.getAddresses().forEach(address -> {
                    AddressDTO addressDTO = AddressDTO.builder()
                            .addressId(address.getId())
                            .type(address.getAddressType())
                            .street(address.getStreet())
                            .city(address.getCity())
                            .state(address.getState())
                            .zipcode(address.getZipcode())
                            .country(address.getCountry())
                            .build();
                    addressDTOS.add(addressDTO);
                });
                request.setAddresses(addressDTOS);
            }

            if(!(contact.getEmails().isEmpty())) {
                List<EmailDTO> emailDTOS = new ArrayList<>();
                contact.getEmails().forEach(email -> {
                    EmailDTO emailDTO = EmailDTO.builder()
                            .emailId(email.getId())
                            .type(email.getEmailType())
                            .address(email.getAddress())
                            .build();
                    emailDTOS.add(emailDTO);
                });
                request.setEmails(emailDTOS);
            }

            if (!(contact.getPhones().isEmpty())) {
                List<PhoneDTO> phoneDTOS = new ArrayList<>();
                contact.getPhones().forEach(phone -> {
                    PhoneDTO phoneDTO = PhoneDTO.builder()
                            .phoneId(phone.getId())
                            .type(phone.getPhoneType())
                            .countryCode(phone.getCountryCode())
                            .number(phone.getNumber())
                            .build();
                    phoneDTOS.add(phoneDTO);
                });
                request.setPhones(phoneDTOS);
            }
        }

        return request;
    }

    // Helper methods
    private String generateApplicationNumber() {
        return "APP-" + LocalDateTime.now().getYear() + "-" +
                UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
