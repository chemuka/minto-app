package com.pjdereva.minto.membership.service.impl;

import com.pjdereva.minto.membership.dto.application.*;
import com.pjdereva.minto.membership.mapper.ApplicationMapper;
import com.pjdereva.minto.membership.mapper.PersonMapper;
import com.pjdereva.minto.membership.mapper.UserMapper;
import com.pjdereva.minto.membership.model.*;
import com.pjdereva.minto.membership.model.transaction.*;
import com.pjdereva.minto.membership.repository.*;
import com.pjdereva.minto.membership.service.DraftApplicationService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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
    private final UserMapper userMapper;
    private final PersonMapper personMapper;
    private final ApplicationMapper applicationMapper;

    /**
     * Save or update application draft
     * This method handles deduplication of all related entities
     */
    @Transactional
    @Override
    public Application saveDraft(User user, ApplicationDTO draft) {
        Application application;

        // Get existing draft or create new one
        if (draft.getId() != null) {
            application = applicationRepository.findById(draft.getId())
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
            application.setNotes(draft.getNotes());
            application.setAppUpdatedAt(LocalDateTime.now());
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

        /*
        Application application = applicationRepository
                .findByIdWithFamily(draftOpt.get().getId())
                .orElseThrow();
        */
        /*
        Application application = draftOpt.get();

        // Convert to Request
        ApplicationDTO draft = new ApplicationDTO();
        draft.setId(application.getId());
        draft.setApplicationNumber(application.getApplicationNumber());
        draft.setApplicationStatus(application.getApplicationStatus().getLabel());
        draft.setUser(userMapper.toGetUserDTO(user));
        draft.setPerson(personMapper.toPersonDTO(user.getPerson()));
        draft.setMaritalStatus(application.getMaritalStatus());
        draft.setNotes(application.getNotes());

        // Convert family members to Requests
        draft.setParents(application.getParents().stream()
                .map(this::convertToParentRequest)
                .collect(Collectors.toSet()));

        draft.setSpouses(application.getSpouses().stream()
                .map(this::convertToSpouseRequest)
                .collect(Collectors.toSet()));

        draft.setChildren(application.getChildren().stream()
                .map(this::convertToChildRequest)
                .collect(Collectors.toSet()));

        draft.setSiblings(application.getSiblings().stream()
                .map(this::convertToSiblingRequest)
                .collect(Collectors.toSet()));

        draft.setRelatives(application.getRelatives().stream()
                .map(this::convertToRelativeRequest)
                .collect(Collectors.toSet()));

        draft.setBeneficiaries(application.getBeneficiaries().stream()
                .map(this::convertToBeneficiaryRequest)
                .collect(Collectors.toSet()));

        draft.setReferees(application.getReferees().stream()
                .map(this::convertToRefereeRequest)
                .collect(Collectors.toSet()));
        */

        //ApplicationDTO draft = ApplicationMapper.INSTANCE.toApplicationDTO(draftOpt.get());
        ApplicationDTO draft = applicationMapper.toApplicationDTO(draftOpt.get());

        log.info("Draft loaded: {}", draft.getApplicationNumber());
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
            person.setDob(LocalDate.parse(data.getDob()));
            person.setLifeStatus(LifeStatus.fromLabel(data.getLifeStatus()));
            person.setUpdatedAt(LocalDateTime.now());

            // Update or create contact
            if (data.getContact() != null) {
                Contact contact = person.getContact();
                if (contact == null) {
                    log.debug("Person -> Contact is NULL");
                    contact = new Contact();
                    person.setContact(contact);
                } else {
                    contact.setUpdatedAt(LocalDateTime.now());
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

    private void updateParents(Application application, Set<ParentDTO> draftParents) {
        if (draftParents == null) return;

        // Get existing parents mapped by ID (if they have one)
        Map<Long, Parent> existingMap = application.getParents().stream()
                .filter(p -> p.getId() != null)
                .collect(Collectors.toMap(Parent::getId, p -> p));

        // Track which existing parents to keep
        Set<Long> idsToKeep = new HashSet<>();

        // Process draft parents
        for (ParentDTO dto : draftParents) {
            if (dto.getId() != null && existingMap.containsKey(dto.getId())) {
                // UPDATE existing parent
                Parent existing = existingMap.get(dto.getId());
                updateParentFromRequest(existing, dto);
                idsToKeep.add(dto.getId());
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

    private void updateSpouses(Application application, Set<SpouseDTO> draftSpouses) {
        if (draftSpouses == null) return;

        Map<Long, Spouse> existingMap = application.getSpouses().stream()
                .filter(s -> s.getId() != null)
                .collect(Collectors.toMap(Spouse::getId, s -> s));

        Set<Long> idsToKeep = new HashSet<>();

        for (SpouseDTO dto : draftSpouses) {
            if (dto.getId() != null && existingMap.containsKey(dto.getId())) {
                Spouse existing = existingMap.get(dto.getId());
                updateSpouseFromRequest(existing, dto);
                idsToKeep.add(dto.getId());
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

    private void updateChildren(Application application, Set<ChildDTO> draftChildren) {
        if (draftChildren == null) return;

        Map<Long, Child> existingMap = application.getChildren().stream()
                .filter(c -> c.getId() != null)
                .collect(Collectors.toMap(Child::getId, c -> c));

        Set<Long> idsToKeep = new HashSet<>();

        for (ChildDTO dto : draftChildren) {
            if (dto.getId() != null && existingMap.containsKey(dto.getId())) {
                Child existing = existingMap.get(dto.getId());
                updateChildFromRequest(existing, dto);
                idsToKeep.add(dto.getId());
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

    private void updateSiblings(Application application, Set<SiblingDTO> draftSiblings) {
        if (draftSiblings == null) return;

        Map<Long, Sibling> existingMap = application.getSiblings().stream()
                .filter(s -> s.getId() != null)
                .collect(Collectors.toMap(Sibling::getId, s -> s));

        Set<Long> idsToKeep = new HashSet<>();

        for (SiblingDTO dto : draftSiblings) {
            if (dto.getId() != null && existingMap.containsKey(dto.getId())) {
                Sibling existing = existingMap.get(dto.getId());
                updateSiblingFromRequest(existing, dto);
                idsToKeep.add(dto.getId());
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

    private void updateRelatives(Application application, Set<RelativeDTO> draftRelatives) {
        if (draftRelatives == null) return;

        Map<Long, Relative> existingMap = application.getRelatives().stream()
                .filter(r -> r.getId() != null)
                .collect(Collectors.toMap(Relative::getId, r -> r));

        Set<Long> idsToKeep = new HashSet<>();

        for (RelativeDTO dto : draftRelatives) {
            if (dto.getId() != null && existingMap.containsKey(dto.getId())) {
                Relative existing = existingMap.get(dto.getId());
                updateRelativeFromRequest(existing, dto);
                idsToKeep.add(dto.getId());
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

    private void updateBeneficiaries(Application application, Set<BeneficiaryDTO> draftBeneficiaries) {
        if (draftBeneficiaries == null) return;

        Map<Long, Beneficiary> existingMap = application.getBeneficiaries().stream()
                .filter(b -> b.getId() != null)
                .collect(Collectors.toMap(Beneficiary::getId, b -> b));

        Set<Long> idsToKeep = new HashSet<>();

        for (BeneficiaryDTO dto : draftBeneficiaries) {
            if (dto.getId() != null && existingMap.containsKey(dto.getId())) {
                Beneficiary existing = existingMap.get(dto.getId());
                updateBeneficiaryFromRequest(existing, dto);
                idsToKeep.add(dto.getId());
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

    private void updateReferees(Application application, Set<RefereeDTO> draftReferees) {
        if (draftReferees == null) return;

        Map<Long, Referee> existingMap = application.getReferees().stream()
                .filter(r -> r.getId() != null)
                .collect(Collectors.toMap(Referee::getId, r -> r));

        Set<Long> idsToKeep = new HashSet<>();

        for (RefereeDTO dto : draftReferees) {
            if (dto.getId() != null && existingMap.containsKey(dto.getId())) {
                Referee existing = existingMap.get(dto.getId());
                updateRefereeFromRequest(existing, dto);
                idsToKeep.add(dto.getId());
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
                .parentType(ParentType.fromLabel(dto.getParentType()))
                .notes(dto.getNotes())
                .build();
    }

    private void updateParentFromRequest(Parent parent, ParentDTO dto) {
        // Update person data
        updatePersonFromRequest(parent.getPerson(), dto);

        // Update parent-specific fields
        parent.setParentType(ParentType.fromLabel(dto.getParentType()));
        parent.setNotes(dto.getNotes());
    }

    private Spouse createSpouseFromRequest(SpouseDTO dto) {
        Person person = createOrUpdatePerson(dto);

        return Spouse.builder()
                .person(person)
                .maritalStatus(MaritalStatus.fromLabel(dto.getMaritalStatus()))
                .notes(dto.getNotes())
                .build();
    }

    private void updateSpouseFromRequest(Spouse spouse, SpouseDTO dto) {
        updatePersonFromRequest(spouse.getPerson(), dto);
        spouse.setMaritalStatus(MaritalStatus.fromLabel(dto.getMaritalStatus()));
        spouse.setNotes(dto.getNotes());
    }

    private Child createChildFromRequest(ChildDTO dto) {
        Person person = createOrUpdatePerson(dto);

        return Child.builder()
                .person(person)
                .childType(ChildType.fromLabel(dto.getChildType()))
                .notes(dto.getNotes())
                .build();
    }

    private void updateChildFromRequest(Child child, ChildDTO dto) {
        updatePersonFromRequest(child.getPerson(), dto);
        child.setChildType(ChildType.fromLabel(dto.getChildType()));
        child.setNotes(dto.getNotes());
    }

    private Sibling createSiblingFromRequest(SiblingDTO dto) {
        Person person = createOrUpdatePerson(dto);

        return Sibling.builder()
                .person(person)
                .siblingType(SiblingType.fromLabel(dto.getSiblingType()))
                .notes(dto.getNotes())
                .build();
    }

    private void updateSiblingFromRequest(Sibling sibling, SiblingDTO dto) {
        updatePersonFromRequest(sibling.getPerson(), dto);
        sibling.setSiblingType(SiblingType.fromLabel(dto.getSiblingType()));
        sibling.setNotes(dto.getNotes());
    }

    private Relative createRelativeFromRequest(RelativeDTO dto) {
        Person person = createOrUpdatePerson(dto);

        return Relative.builder()
                .person(person)
                .familyRelationship(FamilyRelationship.fromLabel(dto.getFamilyRelationship()))
                .membershipNumber(dto.getMembershipNumber())
                .notes(dto.getNotes())
                .build();
    }

    private void updateRelativeFromRequest(Relative relative, RelativeDTO dto) {
        updatePersonFromRequest(relative.getPerson(), dto);
        relative.setFamilyRelationship(FamilyRelationship.fromLabel(dto.getFamilyRelationship()));
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

        if (request.getId() != null) {
            // UPDATE existing person
            person = personRepository.findById(request.getId())
                    .orElseThrow(() -> new RuntimeException("Person not found: " + request.getId()));
            person.setUpdatedAt(LocalDateTime.now());
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
        person.setDob(LocalDate.parse(data.getDob()));
        person.setLifeStatus(LifeStatus.fromLabel(data.getLifeStatus()));
        person.setUpdatedAt(LocalDateTime.now());

        // Update or create contact
        if (data.getContact() != null) {
            Contact contact = person.getContact();
            if (contact == null) {
                log.debug("Person({} {}) -> Contact is NULL", person.getFirstName(), person.getLastName());
                contact = new Contact();
                person.setContact(contact);
            } else {
                contact.setUpdatedAt(LocalDateTime.now());
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
                if (addressDTO.getId() == null) {
                    Address address = Address.builder()
                            .addressType(AddressType.fromLabel(addressDTO.getAddressType()))
                            .street(addressDTO.getStreet())
                            .city(addressDTO.getCity())
                            .state(addressDTO.getState())
                            .zipcode(addressDTO.getZipcode())
                            .country(addressDTO.getCountry())
                            .build();
                    contact.addAddress(address);
                } else {
                    Address existingAddress = addressRepository.findById(addressDTO.getId())
                            .orElseThrow(() -> new EntityNotFoundException("Address with ID " + addressDTO.getId() + " not found"));

                    existingAddress.setAddressType(AddressType.fromLabel(addressDTO.getAddressType()));
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
                if (emailDTO.getId() == null) {
                    Email email = Email.builder()
                            .emailType(EmailType.fromLabel(emailDTO.getEmailType()))
                            .address(emailDTO.getAddress())
                            .build();
                    contact.addEmail(email);
                } else {
                    Email existingEmail = emailRepository.findById(emailDTO.getId())
                            .orElseThrow(() -> new EntityNotFoundException("Email with Id: " + emailDTO.getId() + " not found"));

                    existingEmail.setEmailType(EmailType.fromLabel(emailDTO.getEmailType()));
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
                if (phoneDTO.getId() == null) {
                    Phone phone = Phone.builder()
                            .phoneType(PhoneType.fromLabel(phoneDTO.getPhoneType()))
                            .number(phoneDTO.getNumber())
                            .countryCode(phoneDTO.getCountryCode())
                            .build();
                    contact.addPhone(phone);
                } else {
                    Phone existingPhone = phoneRepository.findById(phoneDTO.getId())
                            .orElseThrow(() -> new EntityNotFoundException("Phone with Id: " + phoneDTO.getId() + " not found"));

                    existingPhone.setPhoneType(PhoneType.fromLabel(phoneDTO.getPhoneType()));
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
        request.setId(parent.getId());
        request.setFirstName(parent.getPerson().getFirstName());
        request.setLastName(parent.getPerson().getLastName());
        request.setMiddleName(parent.getPerson().getMiddleName());
        request.setDob(String.valueOf(parent.getPerson().getDob()));
        request.setLifeStatus(String.valueOf(parent.getPerson().getLifeStatus()));
        request.setContact(convertToContactRequest(parent.getPerson().getContact()));
        request.setParentType(String.valueOf(parent.getParentType()));
        request.setNotes(parent.getNotes());
        return request;
    }

    private SpouseDTO convertToSpouseRequest(Spouse spouse) {
        SpouseDTO request = new SpouseDTO();
        request.setId(spouse.getId());
        request.setFirstName(spouse.getPerson().getFirstName());
        request.setLastName(spouse.getPerson().getLastName());
        request.setMiddleName(spouse.getPerson().getMiddleName());
        request.setDob(String.valueOf(spouse.getPerson().getDob()));
        request.setLifeStatus(String.valueOf(spouse.getPerson().getLifeStatus()));
        request.setContact(convertToContactRequest(spouse.getPerson().getContact()));
        request.setMaritalStatus(String.valueOf(spouse.getMaritalStatus()));
        request.setNotes(spouse.getNotes());
        return request;
    }

    private ChildDTO convertToChildRequest(Child child) {
        ChildDTO request = new ChildDTO();
        request.setId(child.getId());
        request.setFirstName(child.getPerson().getFirstName());
        request.setLastName(child.getPerson().getLastName());
        request.setMiddleName(child.getPerson().getMiddleName());
        request.setDob(String.valueOf(child.getPerson().getDob()));
        request.setLifeStatus(String.valueOf(child.getPerson().getLifeStatus()));
        request.setContact(convertToContactRequest(child.getPerson().getContact()));
        request.setChildType(String.valueOf(child.getChildType()));
        request.setNotes(child.getNotes());
        return request;
    }

    private SiblingDTO convertToSiblingRequest(Sibling sibling) {
        SiblingDTO request = new SiblingDTO();
        request.setId(sibling.getId());
        request.setFirstName(sibling.getPerson().getFirstName());
        request.setLastName(sibling.getPerson().getLastName());
        request.setMiddleName(sibling.getPerson().getMiddleName());
        request.setDob(String.valueOf(sibling.getPerson().getDob()));
        request.setLifeStatus(String.valueOf(sibling.getPerson().getLifeStatus()));
        request.setContact(convertToContactRequest(sibling.getPerson().getContact()));
        request.setSiblingType(String.valueOf(sibling.getSiblingType()));
        request.setNotes(sibling.getNotes());
        return request;
    }

    private RelativeDTO convertToRelativeRequest(Relative relative) {
        RelativeDTO request = new RelativeDTO();
        request.setId(relative.getId());
        request.setFirstName(relative.getPerson().getFirstName());
        request.setLastName(relative.getPerson().getLastName());
        request.setMiddleName(relative.getPerson().getMiddleName());
        request.setDob(String.valueOf(relative.getPerson().getDob()));
        request.setLifeStatus(String.valueOf(relative.getPerson().getLifeStatus()));
        request.setContact(convertToContactRequest(relative.getPerson().getContact()));
        request.setFamilyRelationship(String.valueOf(relative.getFamilyRelationship()));
        request.setMembershipNumber(relative.getMembershipNumber());
        request.setNotes(relative.getNotes());
        return request;
    }

    private BeneficiaryDTO convertToBeneficiaryRequest(Beneficiary beneficiary) {
        BeneficiaryDTO request = new BeneficiaryDTO();
        request.setId(beneficiary.getId());
        request.setFirstName(beneficiary.getPerson().getFirstName());
        request.setLastName(beneficiary.getPerson().getLastName());
        request.setMiddleName(beneficiary.getPerson().getMiddleName());
        request.setDob(String.valueOf(beneficiary.getPerson().getDob()));
        request.setLifeStatus(String.valueOf(beneficiary.getPerson().getLifeStatus()));
        request.setContact(convertToContactRequest(beneficiary.getPerson().getContact()));
        request.setPercentage(beneficiary.getPercentage());
        request.setRelationship(beneficiary.getRelationship());
        request.setNotes(beneficiary.getNotes());
        return request;
    }

    private RefereeDTO convertToRefereeRequest(Referee referee) {
        RefereeDTO request = new RefereeDTO();
        request.setId(referee.getId());
        request.setFirstName(referee.getPerson().getFirstName());
        request.setLastName(referee.getPerson().getLastName());
        request.setMiddleName(referee.getPerson().getMiddleName());
        request.setDob(String.valueOf(referee.getPerson().getDob()));
        request.setLifeStatus(String.valueOf(referee.getPerson().getLifeStatus()));
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
            request.setId(contact.getId());

            if (!(contact.getAddresses().isEmpty())) {
                List<AddressDTO> addressDTOS = new ArrayList<>();
                contact.getAddresses().forEach(address -> {
                    AddressDTO addressDTO = AddressDTO.builder()
                            .id(address.getId())
                            .addressType(String.valueOf(address.getAddressType()))
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
                            .id(email.getId())
                            .emailType(String.valueOf(email.getEmailType()))
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
                            .id(phone.getId())
                            .phoneType(String.valueOf(phone.getPhoneType()))
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
