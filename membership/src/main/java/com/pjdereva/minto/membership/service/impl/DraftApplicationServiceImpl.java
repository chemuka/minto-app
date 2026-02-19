package com.pjdereva.minto.membership.service.impl;

import com.pjdereva.minto.membership.dto.application.*;
import com.pjdereva.minto.membership.mapper.*;
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
    //private final UserMapper userMapper;
    //private final PersonMapper personMapper;
    private final ApplicationMapper applicationMapper;
    private final ParentMapper parentMapper;
    private final SpouseMapper spouseMapper;
    private final ChildMapper childMapper;
    private final SiblingMapper siblingMapper;
    private final RefereeMapper refereeMapper;
    private final RelativeMapper relativeMapper;
    private final BeneficiaryMapper beneficiaryMapper;
    private final AddressMapper addressMapper;
    private final EmailMapper emailMapper;
    private final PhoneMapper phoneMapper;

    /**
     * Save or update application draft
     * This method handles deduplication of all related entities
     */
    @Transactional
    @Override
    public ApplicationDTO saveDraft(User user, ApplicationDTO draft) {
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
        //updatePersonalInfo(user.getPerson().getId(), draft.getPerson());
        updatePersonalInfo(application, draft.getPerson());

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
        return applicationMapper.toApplicationDTO(application);
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
            Application newApp = Application.builder()
                    .applicationNumber(generateApplicationNumber())
                    .applicationStatus(ApplicationStatus.DRAFT)
                    .notes("Created by user: " + user.getEmail())
                    .build();
            newApp.setUser(user);
            newApp.setPerson(user.getPerson());
            return applicationMapper.toApplicationDTO(newApp);
            // Return empty draft
            //return new ApplicationDTO();
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

    /**
     * Submit draft application
     * This method handles deduplication of all related entities
     */
    @Transactional
    @Override
    public ApplicationDTO submitDraft(User user, ApplicationDTO draft) {
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

            log.info("Updating draft application: {}", application.getApplicationNumber());
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
                newApp.addPerson(user.getPerson());
                //newApp = applicationRepository.save(newApp);
                return newApp;
            });

            log.info("Creating a new draft application");
        }

        // Update basic application info
        application.setMaritalStatus(draft.getMaritalStatus());

        // TODO: Update person info with deduplication
        //updatePersonalInfo(user.getPerson().getId(), draft.getPerson());
        //updatePersonalInfo(user, draft.getPerson());
        updatePersonalInfo(application, draft.getPerson());

        // Update family members with deduplication
        updateParents(application, draft.getParents());
        updateSpouses(application, draft.getSpouses());
        updateChildren(application, draft.getChildren());
        updateSiblings(application, draft.getSiblings());
        updateRelatives(application, draft.getRelatives());
        updateBeneficiaries(application, draft.getBeneficiaries());
        updateReferees(application, draft.getReferees());

        application.submit();
        //user.addApplication(application);
        application = applicationRepository.save(application);

        log.info("Draft application submitted successfully: {}", application.getApplicationNumber());
        return applicationMapper.toApplicationDTO(application);
    }

    /**
     * Save or update application draft
     * This method handles deduplication of all related entities
     */
    @Transactional
    @Override
    public ApplicationDTO updateApplication(User user, ApplicationDTO draft) {
        Application application;

        // Get existing draft or create new one
        if (draft.getId() != null) {
            application = applicationRepository.findById(draft.getId())
                    .orElseThrow(() -> new RuntimeException("Application not found"));

            // Verify authorization
            // TODO: Fix authorization in the Security Configuration
            if (!(user.isAdmin() || user.isStaff())) {
                throw new SecurityException("User does not have appropriate authority to update application");
            }

            log.info("Updating existing application: {}", application.getApplicationNumber());
            application.setNotes(draft.getNotes());
            application.setAppUpdatedAt(LocalDateTime.now());
        } else {
            // Application does not exist
            log.info("Application does not exist");
            throw new RuntimeException("Application does not exist");
        }

        // Update basic application info
        application.setMaritalStatus(draft.getMaritalStatus());

        // Update application status
        updateApplicationStatus(application, draft.getApplicationStatus());

        // TODO: Update person info with deduplication
        //updatePersonalInfo(user.getPerson().getId(), draft.getPerson());
        updatePersonalInfo(application, draft.getPerson());

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

        log.info("Application updated successfully: {}", application.getApplicationNumber());
        return applicationMapper.toApplicationDTO(application);
    }

    // ========================================================================
    // DEDUPLICATION METHODS - Key to preventing duplicates
    // ========================================================================

    private void updateApplicationStatus(Application application, ApplicationStatus applicationStatus) {

        switch (applicationStatus) {
            case DRAFT -> {
                if (application.getApplicationStatus().equals(ApplicationStatus.DRAFT))
                    break;
                application.setApprovedDate(null);
                application.setSubmittedDate(null);
                application.setRejectedDate(null);
                application.setRejectionReason("");
                application.setApplicationStatus(applicationStatus);
            }
            case SUBMITTED -> {
                if (application.getApplicationStatus().equals(ApplicationStatus.SUBMITTED))
                    break;
                application.setApprovedDate(null);
                application.setRejectedDate(null);
                application.setRejectionReason("");
                application.submit();
            }
            case UNDER_REVIEW -> {
                if (application.getApplicationStatus().equals(ApplicationStatus.UNDER_REVIEW))
                    break;
                application.setApprovedDate(null);
                application.setRejectedDate(null);
                application.setRejectionReason("");
                application.setApplicationStatus(applicationStatus);
            }
            case RETURNED -> {
                if (application.getApplicationStatus().equals(ApplicationStatus.RETURNED))
                    break;
                application.returned();
            }
            case REJECTED -> {
                if (application.getApplicationStatus().equals(ApplicationStatus.REJECTED))
                    break;
                application.reject("Rejected by Admin/Staff through an update.");
            }
            case APPROVED -> {
                if (application.getApplicationStatus().equals(ApplicationStatus.APPROVED))
                    break;
                if(application.getApplicationStatus().equals(ApplicationStatus.DRAFT) ||
                application.getApplicationStatus().equals(ApplicationStatus.RETURNED) ||
                application.getApplicationStatus().equals(ApplicationStatus.WITHDRAWN)) {
                    application.submit();
                }
                application.approve();

            }
            case WITHDRAWN -> application.setApplicationStatus(applicationStatus);
        }
    }

    private void updatePersonalInfo(Application application, PersonDTO data) {
        if (data == null) return;

        Person person = null;

        if(application.getPerson() == null) {
            person = createOrUpdatePerson(data);
            application.addPerson(person);
        } else {
            Optional<Person> personOpt = personRepository.findById(application.getPerson().getId());
            if(personOpt.isPresent()) {
                person = personOpt.get();
                updatePersonFromRequest(person, data);
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
                //Parent newParent = parentMapper.toParent(dto);
                newParent.setApplication(application);
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
                // UPDATE existing spouse
                Spouse existing = existingMap.get(dto.getId());
                updateSpouseFromRequest(existing, dto);
                idsToKeep.add(dto.getId());
            } else {
                // CREATE new spouse
                Spouse newSpouse = createSpouseFromRequest(dto);
                //Spouse newSpouse = spouseMapper.toSpouse(dto);
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
                // UPDATE existing child
                Child existing = existingMap.get(dto.getId());
                updateChildFromRequest(existing, dto);
                idsToKeep.add(dto.getId());
            } else {
                // CREATE new child
                Child newChild = createChildFromRequest(dto);
                //Child newChild = childMapper.toChild(dto);
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
                // UPDATE existing sibling
                Sibling existing = existingMap.get(dto.getId());
                updateSiblingFromRequest(existing, dto);
                idsToKeep.add(dto.getId());
            } else {
                // CREATE new sibling
                Sibling newSibling = createSiblingFromRequest(dto);
                //Sibling newSibling = siblingMapper.toSibling(dto);
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
                // UPDATE existing relative
                Relative existing = existingMap.get(dto.getId());
                updateRelativeFromRequest(existing, dto);
                idsToKeep.add(dto.getId());
            } else {
                // CREATE new relative
                Relative newRelative = createRelativeFromRequest(dto);
                //Relative newRelative = relativeMapper.toRelative(dto);
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
                // UPDATE existing beneficiary
                Beneficiary existing = existingMap.get(dto.getId());
                updateBeneficiaryFromRequest(existing, dto);
                idsToKeep.add(dto.getId());
            } else {
                // CREATE new beneficiary
                Beneficiary newBeneficiary = createBeneficiaryFromRequest(dto);
                //Beneficiary newBeneficiary = beneficiaryMapper.toBeneficiary(dto);
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
                // UPDATE existing referee
                Referee existing = existingMap.get(dto.getId());
                updateRefereeFromRequest(existing, dto);
                idsToKeep.add(dto.getId());
            } else {
                // CREATE new referee
                Referee newReferee = createRefereeFromRequest(dto);
                //Referee newReferee = refereeMapper.toReferee(dto);
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
        Person person = createOrUpdatePerson(dto.getPerson());

        return Parent.builder()
                .person(person)
                .parentType(dto.getParentType())
                .notes(dto.getNotes())
                .build();
    }

    private void updateParentFromRequest(Parent parent, ParentDTO dto) {
        // Update person data
        updatePersonFromRequest(parent.getPerson(), dto.getPerson());

        // Update parent-specific fields
        parent.setParentType(dto.getParentType());
        parent.setNotes(dto.getNotes());
    }

    private Spouse createSpouseFromRequest(SpouseDTO dto) {
        Person person = createOrUpdatePerson(dto.getPerson());

        return Spouse.builder()
                .person(person)
                .maritalStatus(dto.getMaritalStatus())
                .notes(dto.getNotes())
                .build();
    }

    private void updateSpouseFromRequest(Spouse spouse, SpouseDTO dto) {
        updatePersonFromRequest(spouse.getPerson(), dto.getPerson());
        spouse.setMaritalStatus(dto.getMaritalStatus());
        spouse.setNotes(dto.getNotes());
    }

    private Child createChildFromRequest(ChildDTO dto) {
        Person person = createOrUpdatePerson(dto.getPerson());

        return Child.builder()
                .person(person)
                .childType(dto.getChildType())
                .notes(dto.getNotes())
                .build();
    }

    private void updateChildFromRequest(Child child, ChildDTO dto) {
        updatePersonFromRequest(child.getPerson(), dto.getPerson());
        child.setChildType(dto.getChildType());
        child.setNotes(dto.getNotes());
    }

    private Sibling createSiblingFromRequest(SiblingDTO dto) {
        Person person = createOrUpdatePerson(dto.getPerson());

        return Sibling.builder()
                .person(person)
                .siblingType(dto.getSiblingType())
                .notes(dto.getNotes())
                .build();
    }

    private void updateSiblingFromRequest(Sibling sibling, SiblingDTO dto) {
        updatePersonFromRequest(sibling.getPerson(), dto.getPerson());
        sibling.setSiblingType(dto.getSiblingType());
        sibling.setNotes(dto.getNotes());
    }

    private Relative createRelativeFromRequest(RelativeDTO dto) {
        Person person = createOrUpdatePerson(dto.getPerson());

        return Relative.builder()
                .person(person)
                .familyRelationship(dto.getFamilyRelationship())
                .membershipNumber(dto.getMembershipNumber())
                .notes(dto.getNotes())
                .build();
    }

    private void updateRelativeFromRequest(Relative relative, RelativeDTO dto) {
        updatePersonFromRequest(relative.getPerson(), dto.getPerson());
        relative.setFamilyRelationship(dto.getFamilyRelationship());
        relative.setMembershipNumber(dto.getMembershipNumber());
        relative.setNotes(dto.getNotes());
    }

    private Beneficiary createBeneficiaryFromRequest(BeneficiaryDTO dto) {
        Person person = createOrUpdatePerson(dto.getPerson());

        return Beneficiary.builder()
                .person(person)
                .percentage(dto.getPercentage())
                .relationship(dto.getRelationship())
                .notes(dto.getNotes())
                .build();
    }

    private void updateBeneficiaryFromRequest(Beneficiary beneficiary, BeneficiaryDTO dto) {
        updatePersonFromRequest(beneficiary.getPerson(), dto.getPerson());
        beneficiary.setPercentage(dto.getPercentage());
        beneficiary.setRelationship(dto.getRelationship());
        beneficiary.setNotes(dto.getNotes());
    }

    private Referee createRefereeFromRequest(RefereeDTO dto) {
        Person person = createOrUpdatePerson(dto.getPerson());

        return Referee.builder()
                .person(person)
                .membershipNumber(dto.getMembershipNumber())
                .comments(dto.getComments())
                .notes(dto.getNotes())
                .build();
    }

    private void updateRefereeFromRequest(Referee referee, RefereeDTO dto) {
        updatePersonFromRequest(referee.getPerson(), dto.getPerson());
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
            //person.setUpdatedAt(LocalDateTime.now());
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
        person.setLifeStatus(data.getLifeStatus());
        person.setUpdatedAt(LocalDateTime.now());

        // Update or create contact
        if (data.getContact() != null) {
            Contact contact = person.getContact();
            if (contact == null) {
                // CREATE new contact
                log.debug("Person({} {}) -> Contact is NULL", person.getFirstName(), person.getLastName());
                contact = new Contact();
                person.setContact(contact);
            } else {
                // UPDATE existing contact
                contact.setUpdatedAt(LocalDateTime.now());
            }

            // Update addresses
            updateContactAddresses(contact, data.getContact().getAddresses());
            // Update email
            updateContactEmails(contact, data.getContact().getEmails());

            // Update phone
            updateContactPhones(contact, data.getContact().getPhones());
        } else {
            // TODO: Remove any existing addresses
            person.setContact(null);
            log.debug("PersonDTO({} {}) -> Contact is NULL", data.getFirstName(), data.getLastName());
        }
    }
    private void updateContactAddresses(Contact contact, List<AddressDTO> addressDTOS) {
        if (!(addressDTOS.isEmpty())) {
            Set<Address> updatedAddressSet = Set.copyOf(addressMapper.toAddressList(addressDTOS));
            Set<Address> addressesToRemove = new HashSet<>(contact.getAddresses());
            addressesToRemove.removeAll(updatedAddressSet);
            addressesToRemove.forEach(contact::removeAddress);

            addressDTOS.forEach(addressDTO -> {
                if (addressDTO.getId() == null) {
                    Address address = Address.builder()
                            .addressType(addressDTO.getAddressType())
                            .street(addressDTO.getStreet())
                            .city(addressDTO.getCity())
                            .state(addressDTO.getState())
                            .zipcode(addressDTO.getZipcode())
                            .country(addressDTO.getCountry())
                            .contact(contact)
                            .build();
                    contact.addAddress(address);
                } else {
                    Address existingAddress = addressRepository.findById(addressDTO.getId())
                            .orElseThrow(() -> new EntityNotFoundException("Address with ID " + addressDTO.getId() + " not found"));

                    existingAddress.setAddressType(addressDTO.getAddressType());
                    existingAddress.setStreet(addressDTO.getStreet());
                    existingAddress.setCity(addressDTO.getCity());
                    existingAddress.setState(addressDTO.getState());
                    existingAddress.setZipcode(addressDTO.getZipcode());
                    existingAddress.setCountry(addressDTO.getCountry());
                    existingAddress.setContact(contact);
                }
            });
        } else {
            //contact.setAddresses(null);
            contact.getAddresses().clear();
        }
        //contact.setAddresses(addressDTOS);
    }

    /**
     * Update contact email - prevents duplicate email records
     */
    private void updateContactEmails(Contact contact, List<EmailDTO> emailDTOS) {
        if(emailDTOS.isEmpty()) {
            contact.getEmails().clear();
        } else {
            Set<Email> updatedEmailSet = Set.copyOf(emailMapper.toEmailList(emailDTOS));
            Set<Email> emailsToRemove = new HashSet<>(contact.getEmails());
            emailsToRemove.removeAll(updatedEmailSet);
            emailsToRemove.forEach(contact::removeEmail);

            updatedEmailSet.forEach(emailDTO -> {
                if (emailDTO.getId() == null) {
                    Email email = Email.builder()
                            .emailType(emailDTO.getEmailType())
                            .address(emailDTO.getAddress())
                            .contact(contact)
                            .build();
                    contact.addEmail(email);
                } else {
                    Email existingEmail = emailRepository.findById(emailDTO.getId())
                            .orElseThrow(() -> new EntityNotFoundException("Email with Id: " + emailDTO.getId() + " not found"));

                    existingEmail.setEmailType(emailDTO.getEmailType());
                    existingEmail.setAddress(emailDTO.getAddress());
                    existingEmail.setContact(contact);
                }
            });

        }
        /*
        if (!(emailDTOS.isEmpty())) {
            emailDTOS.forEach(emailDTO -> {
                if (emailDTO.getId() == null) {
                    Email email = Email.builder()
                            .emailType(emailDTO.getEmailType())
                            .address(emailDTO.getAddress())
                            .contact(contact)
                            .build();
                    contact.addEmail(email);
                } else {
                    Email existingEmail = emailRepository.findById(emailDTO.getId())
                            .orElseThrow(() -> new EntityNotFoundException("Email with Id: " + emailDTO.getId() + " not found"));

                    existingEmail.setEmailType(emailDTO.getEmailType());
                    existingEmail.setAddress(emailDTO.getAddress());
                    existingEmail.setContact(contact);
                }
            });
        } else {
            contact.getEmails().clear();
        }
        */
    }

    /**
     * Update contact phone - prevents duplicate phone records
     */
    private void updateContactPhones(Contact contact, List<PhoneDTO> phoneDTOS) {
        if (!(phoneDTOS.isEmpty())) {
            Set<Phone> updatedPhoneSet = Set.copyOf(phoneMapper.toPhoneList(phoneDTOS));
            Set<Phone> phonesToRemove = new HashSet<>(contact.getPhones());
            phonesToRemove.removeAll(updatedPhoneSet);
            phonesToRemove.forEach(contact::removePhone);

            phoneDTOS.forEach(phoneDTO -> {
                if (phoneDTO.getId() == null) {
                    Phone phone = Phone.builder()
                            .phoneType(phoneDTO.getPhoneType())
                            .number(phoneDTO.getNumber())
                            .countryCode(phoneDTO.getCountryCode())
                            .contact(contact)
                            .build();
                    contact.addPhone(phone);
                } else {
                    Phone existingPhone = phoneRepository.findById(phoneDTO.getId())
                            .orElseThrow(() -> new EntityNotFoundException("Phone with Id: " + phoneDTO.getId() + " not found"));

                    existingPhone.setPhoneType(phoneDTO.getPhoneType());
                    existingPhone.setNumber(phoneDTO.getNumber());
                    existingPhone.setCountryCode(phoneDTO.getCountryCode());
                    existingPhone.setContact(contact);
                }
            });
        } else {
            contact.getPhones().clear();
        }
    }

    // ========================================================================
    // REQUEST CONVERSION METHODS
    // ========================================================================

    private ParentDTO convertToParentRequest(Parent parent) {
        /*
        ParentDTO request = new ParentDTO();
        request.setId(parent.getId());
        request.setFirstName(parent.getPerson().getFirstName());
        request.setLastName(parent.getPerson().getLastName());
        request.setMiddleName(parent.getPerson().getMiddleName());
        request.setDob(String.valueOf(parent.getPerson().getDob()));
        request.setLifeStatus(parent.getPerson().getLifeStatus());
        request.setContact(convertToContactRequest(parent.getPerson().getContact()));
        request.setParentType(parent.getParentType());
        request.setNotes(parent.getNotes()); */
        return parentMapper.toParentDTO(parent);
    }

    private SpouseDTO convertToSpouseRequest(Spouse spouse) {
        /*
        SpouseDTO request = new SpouseDTO();
        request.setId(spouse.getId());
        request.setFirstName(spouse.getPerson().getFirstName());
        request.setLastName(spouse.getPerson().getLastName());
        request.setMiddleName(spouse.getPerson().getMiddleName());
        request.setDob(String.valueOf(spouse.getPerson().getDob()));
        request.setLifeStatus(spouse.getPerson().getLifeStatus());
        request.setContact(convertToContactRequest(spouse.getPerson().getContact()));
        request.setMaritalStatus(spouse.getMaritalStatus());
        request.setNotes(spouse.getNotes()); */
        return spouseMapper.toSpouseDTO(spouse);
    }

    private ChildDTO convertToChildRequest(Child child) {
        /*
        ChildDTO request = new ChildDTO();
        request.setId(child.getId());
        request.setFirstName(child.getPerson().getFirstName());
        request.setLastName(child.getPerson().getLastName());
        request.setMiddleName(child.getPerson().getMiddleName());
        request.setDob(String.valueOf(child.getPerson().getDob()));
        request.setLifeStatus(child.getPerson().getLifeStatus());
        request.setContact(convertToContactRequest(child.getPerson().getContact()));
        request.setChildType(child.getChildType());
        request.setNotes(child.getNotes()); */
        return childMapper.toChildDTO(child);
    }

    private SiblingDTO convertToSiblingRequest(Sibling sibling) {
        /*
        SiblingDTO request = new SiblingDTO();
        request.setId(sibling.getId());
        request.setFirstName(sibling.getPerson().getFirstName());
        request.setLastName(sibling.getPerson().getLastName());
        request.setMiddleName(sibling.getPerson().getMiddleName());
        request.setDob(String.valueOf(sibling.getPerson().getDob()));
        request.setLifeStatus(sibling.getPerson().getLifeStatus());
        request.setContact(convertToContactRequest(sibling.getPerson().getContact()));
        request.setSiblingType(sibling.getSiblingType());
        request.setNotes(sibling.getNotes()); */
        return siblingMapper.toSiblingDTO(sibling);
    }

    private RelativeDTO convertToRelativeRequest(Relative relative) {
        /*
        RelativeDTO request = new RelativeDTO();
        request.setId(relative.getId());
        request.setFirstName(relative.getPerson().getFirstName());
        request.setLastName(relative.getPerson().getLastName());
        request.setMiddleName(relative.getPerson().getMiddleName());
        request.setDob(String.valueOf(relative.getPerson().getDob()));
        request.setLifeStatus(relative.getPerson().getLifeStatus());
        request.setContact(convertToContactRequest(relative.getPerson().getContact()));
        request.setFamilyRelationship(relative.getFamilyRelationship());
        request.setMembershipNumber(relative.getMembershipNumber());
        request.setNotes(relative.getNotes()); */
        return relativeMapper.toRelativeDTO(relative);
    }

    private BeneficiaryDTO convertToBeneficiaryRequest(Beneficiary beneficiary) {
        /*
        BeneficiaryDTO request = new BeneficiaryDTO();
        request.setId(beneficiary.getId());
        request.setFirstName(beneficiary.getPerson().getFirstName());
        request.setLastName(beneficiary.getPerson().getLastName());
        request.setMiddleName(beneficiary.getPerson().getMiddleName());
        request.setDob(String.valueOf(beneficiary.getPerson().getDob()));
        request.setLifeStatus(beneficiary.getPerson().getLifeStatus());
        request.setContact(convertToContactRequest(beneficiary.getPerson().getContact()));
        request.setPercentage(beneficiary.getPercentage());
        request.setRelationship(beneficiary.getRelationship());
        request.setNotes(beneficiary.getNotes()); */
        return beneficiaryMapper.toBeneficiaryDTO(beneficiary);
    }

    private RefereeDTO convertToRefereeRequest(Referee referee) {
        /*
        RefereeDTO request = new RefereeDTO();
        request.setId(referee.getId());
        request.setFirstName(referee.getPerson().getFirstName());
        request.setLastName(referee.getPerson().getLastName());
        request.setMiddleName(referee.getPerson().getMiddleName());
        request.setDob(String.valueOf(referee.getPerson().getDob()));
        request.setLifeStatus(referee.getPerson().getLifeStatus());
        request.setContact(convertToContactRequest(referee.getPerson().getContact()));
        request.setMembershipNumber(referee.getMembershipNumber());
        request.setComments(referee.getComments());
        request.setNotes(referee.getNotes()); */
        return refereeMapper.toRefereeDTO(referee);
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
                            .addressType(address.getAddressType())
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
                            .emailType(email.getEmailType())
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
                            .phoneType(phone.getPhoneType())
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
