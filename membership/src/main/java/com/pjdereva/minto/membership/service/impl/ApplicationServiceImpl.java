package com.pjdereva.minto.membership.service.impl;

import com.pjdereva.minto.membership.dto.application.ApplicationDTO;
import com.pjdereva.minto.membership.dto.application.PersonDTO;
import com.pjdereva.minto.membership.mapper.*;
import com.pjdereva.minto.membership.model.*;
import com.pjdereva.minto.membership.model.transaction.*;
import com.pjdereva.minto.membership.repository.ApplicationRepository;
import com.pjdereva.minto.membership.repository.PersonRepository;
import com.pjdereva.minto.membership.repository.UserRepository;
import com.pjdereva.minto.membership.service.ApplicationService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

/**
 * Application service - User creates applications
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final PersonRepository personRepository;
    private final ApplicationMapper applicationMapper;
    private final ParentMapper parentMapper;
    private final SpouseMapper spouseMapper;
    private final ChildMapper childMapper;
    private final SiblingMapper siblingMapper;
    private final RefereeMapper refereeMapper;
    private final RelativeMapper relativeMapper;
    private final BeneficiaryMapper beneficiaryMapper;

    /**
     * User creates a new application
     */
    @Transactional
    public Application createApplicationForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Validate user can apply
        if (!user.canApply()) {
            throw new IllegalStateException("User cannot apply at this time");
        }

        if (user.hasActiveApplication()) {
            throw new IllegalStateException("User already has an active application");
        }

        // Get user's person
        Person person = user.getPerson();
        if (person == null) {
            //throw new IllegalStateException("User has no person record");
            // Create Person with basic info
            person = Person.builder()
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .lifeStatus(LifeStatus.LIVING)
                    .updatedAt(LocalDateTime.now())
                    .build();

            // Create Contact with email
            Contact contact = Contact.builder()
                    .notes("Created by User.")
                    .build();

            Email email = Email.builder()
                    .emailType(EmailType.PERSONAL)
                    .address(user.getEmail())
                    .build();

            contact.addEmail(email);
            person.setContact(contact);
        }

        // Create application
        Application application = Application.builder()
                .applicationNumber(generateApplicationNumber())
                .applicationStatus(ApplicationStatus.DRAFT)
                .notes("Created by user: " + user.getEmail())
                .build();

        application.setUser(user);
        application.setPerson(person);
        user.addApplication(application);

        application = applicationRepository.save(application);

        log.info("Application {} created for user {}",
                application.getApplicationNumber(), user.getEmail());

        return application;
    }

    /**
     * Add people (family members, relatives, referees and beneficiaries) and other info to the application
     */
    @Transactional
    public void addPeopleAndOtherInfo(ApplicationDTO request) {
        log.info("Find application with id: {}", request.getId());
        Application application = applicationRepository.findById(request.getId())
                .orElseThrow(() -> new RuntimeException("Application not found"));

        log.info("Verify ownership and editable");
        // Verify ownership and editable
        if (!application.getUser().getId().equals(request.getUser().getId())) {
            throw new SecurityException("User does not own this application.");
        }
        if (!application.isEditable()) {
            throw new IllegalStateException("Application cannot be edited.");
        }
        if (application.getPerson() == null) {
            throw new IllegalStateException("Application has no person record.");
        }

        application.setMaritalStatus(request.getMaritalStatus());

        // Add Person details for Application
        if (request.getPerson() != null) {
            Person appPerson = application.getPerson();
            Person personObj = createPersonFromRequest(request.getPerson());
            appPerson.setFirstName(personObj.getFirstName());
            appPerson.setLastName(personObj.getLastName());
            appPerson.setMiddleName(personObj.getMiddleName());
            appPerson.setDob(personObj.getDob());
            appPerson.setLifeStatus(personObj.getLifeStatus());
            appPerson.setContact(personObj.getContact());
        }

        log.info("Add parents");
        // Add parents
        if (request.getParents() != null) {
            request.getParents().forEach(parentReq -> {
                /*
                Person parentPerson = createPersonFromRequest(parentReq);
                Parent parent = Parent.builder()
                        .person(parentPerson)
                        .parentType(parentReq.getParentType())
                        .build(); */
                Parent parent = parentMapper.toParent(parentReq);
                application.addParent(parent);
            });
        }

        // Add spouses
        if (request.getSpouses() != null) {
            request.getSpouses().forEach(spouseReq -> {
                /*
                Person spousePerson = createPersonFromRequest(spouseReq);
                Spouse spouse = Spouse.builder()
                        .person(spousePerson)
                        .maritalStatus(spouseReq.getMaritalStatus())
                        .build(); */
                Spouse spouse = spouseMapper.toSpouse(spouseReq);
                application.addSpouse(spouse);
            });
        }

        // Add children
        if (request.getChildren() != null) {
            request.getChildren().forEach(childReq -> {
                /*
                Person childPerson = createPersonFromRequest(childReq);
                Child child = Child.builder()
                        .person(childPerson)
                        .childType(childReq.getChildType())
                        .build(); */
                Child child = childMapper.toChild(childReq);
                application.addChild(child);
            });
        }

        // Add siblings
        if (request.getSiblings() != null) {
            request.getSiblings().forEach(siblingRequest -> {
                /*
                Person siblingPerson = createPersonFromRequest(siblingRequest);
                Sibling sibling = Sibling.builder()
                        .person(siblingPerson)
                        .siblingType(siblingRequest.getSiblingType())
                        .build(); */
                Sibling sibling = siblingMapper.toSibling(siblingRequest);
                application.addSibling(sibling);
            });
        }

        // Add referees
        if (request.getReferees() != null) {
            request.getReferees().forEach(refereeRequest -> {
                /*
                Person refereePerson = createPersonFromRequest(refereeRequest);
                Referee referee = Referee.builder()
                        .person(refereePerson)
                        .membershipNumber((refereeRequest.getMembershipNumber() == null) ? "MEM-New-001" : refereeRequest.getMembershipNumber())
                        .build(); */
                Referee referee = refereeMapper.toReferee(refereeRequest);
                application.addReferee(referee);
            });
        }

        // Add relatives
        if (request.getRelatives() != null) {
            request.getRelatives().forEach(relativeRequest -> {
                /*
                Person relativePerson = createPersonFromRequest(relativeRequest);
                Relative relative = Relative.builder()
                        .person(relativePerson)
                        .membershipNumber((relativeRequest.getMembershipNumber() == null) ? "MEM-New-001" : relativeRequest.getMembershipNumber())
                        .familyRelationship(relativeRequest.getFamilyRelationship())
                        .build(); */
                Relative relative = relativeMapper.toRelative(relativeRequest);
                application.addRelative(relative);
            });
        }

        // Add beneficiaries
        if (request.getBeneficiaries() != null) {
            request.getBeneficiaries().forEach(beneficiaryRequest -> {
                /*
                Person beneficiaryPerson = createPersonFromRequest(beneficiaryRequest);
                Beneficiary beneficiary = Beneficiary.builder()
                        .person(beneficiaryPerson)
                        .relationship(beneficiaryRequest.getRelationship())
                        .percentage(beneficiaryRequest.getPercentage())
                        .build(); */
                Beneficiary beneficiary = beneficiaryMapper.toBeneficiary(beneficiaryRequest);
                application.addBeneficiary(beneficiary);
            });
        }

        log.info("Save application: {}", application.getMaritalStatus());
        applicationRepository.save(application);
        log.info("Family members, referees and beneficiaries added to application {}",
                application.getApplicationNumber());
    }

    /**
     * User submits application
     */
    @Transactional
    public void submitApplication(Long applicationId, Long userId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        // Verify ownership
        if (!application.getUser().getId().equals(userId)) {
            throw new SecurityException("User does not own this application");
        }

        if (!application.isEditable()) {
            throw new IllegalStateException("Application cannot be edited");
        }

        // Validate application is complete
        validateApplication(application);

        application.submit();
        applicationRepository.save(application);

        log.info("Application {} submitted by user {}",
                application.getApplicationNumber(), application.getUser().getEmail());
    }

    /**
     * Staff/Admin reviews application
     */
    @Transactional
    public void setApplicationUnderReview(Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (application.getApplicationStatus() != ApplicationStatus.SUBMITTED) {
            throw new IllegalStateException("Only submitted applications can be reviewed");
        }

        application.setApplicationStatus(ApplicationStatus.UNDER_REVIEW);
        applicationRepository.save(application);

        log.info("Application {} is now under review", application.getApplicationNumber());
    }

    /**
     * Staff/Admin approves application
     */
    @Transactional
    public void approveApplication(Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (application.getApplicationStatus() != ApplicationStatus.UNDER_REVIEW) {
            throw new IllegalStateException("Application must be under review to approve");
        }

        application.approve();
        applicationRepository.save(application);

        log.info("Application {} approved", application.getApplicationNumber());
    }

    /**
     * Staff/Admin rejects application
     */
    @Transactional
    public void rejectApplication(Long applicationId, String reason) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        application.reject(reason);
        applicationRepository.save(application);

        log.info("Application {} rejected: {}", application.getApplicationNumber(), reason);
    }

    /**
     * Staff/Admin return application
     */
    @Transactional
    public void returnApplication(Long applicationId, String notes) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (application.getApplicationStatus() == ApplicationStatus.DRAFT) {
            throw new IllegalStateException("Draft applications cannot be returned");
        }

        if (application.getApplicationStatus() == ApplicationStatus.REJECTED) {
            throw new IllegalStateException("Rejected applications cannot be returned");
        }

        application.setApplicationStatus(ApplicationStatus.RETURNED);
        application.setNotes(notes);
        applicationRepository.save(application);

        log.info("Application {} returned: {}", application.getApplicationNumber(), notes);
    }

    /**
     * User withdraws application
     */
    @Transactional
    public void withdrawApplication(Long applicationId, Long userId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        // Verify ownership
        if (!application.getUser().getId().equals(userId)) {
            throw new SecurityException("User does not own this application");
        }

        if (application.getApplicationStatus() == ApplicationStatus.APPROVED) {
            throw new IllegalStateException("Cannot withdraw approved application");
        }

        application.setApplicationStatus(ApplicationStatus.WITHDRAWN);
        applicationRepository.save(application);

        log.info("Application {} withdrawn by user", application.getApplicationNumber());
    }

    // Helper methods
    private String generateApplicationNumber() {
        return "APP-" + LocalDateTime.now().getYear() + "-" +
                UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private void validateApplication(Application application) {
        if (application.getMaritalStatus() == null) {
            throw new IllegalStateException("Marital status is required");
        }

        if (application.getMaritalStatus() == MaritalStatus.MARRIED
                && application.getSpouses().isEmpty()) {
            throw new IllegalStateException("Married applicant must have at least one spouse");
        }

        if (application.getParents() != null) {
            application.getParents().forEach(parent -> {
                if (parent.getParentType() == null) {
                    throw new IllegalStateException("Parent type is required");
                }
            });
        }

        if (application.getBeneficiaries() != null) {
            application.getBeneficiaries().forEach(beneficiary -> {
                if (beneficiary.getRelationship() == null) {
                    throw new IllegalStateException("Relationship is required");
                }
                if (beneficiary.getPercentage() == null) {
                    throw new IllegalStateException("Percentage is required");
                }
            });
        }

        // Additional validations as needed
    }

    @Override
    public Optional<Application> createApplication(Application application) {
        if(!applicationRepository.applicationExistsByPersonId(application.getPerson().getId())){
            Application newApplication = Application.builder()
                    .applicationStatus(ApplicationStatus.DRAFT)
                    .maritalStatus(MaritalStatus.fromLabel(String.valueOf(application.getMaritalStatus())))
                    .person(application.getPerson())
                    .parents(application.getParents())
                    .spouses(application.getSpouses())
                    .children(application.getChildren())
                    .siblings(application.getSiblings())
                    .referees(application.getReferees())
                    .relatives(application.getRelatives())
                    .beneficiaries(application.getBeneficiaries())
                    .appCreatedAt(LocalDateTime.now())
                    .appUpdatedAt(LocalDateTime.now())
                    .build();
            var savedApplication = applicationRepository.save(newApplication);
            return Optional.of(savedApplication);
        } else {
            return Optional.empty();
        }
    }

    @Override
    public Application saveApplication(Application application) {
        return applicationRepository.save(application);
    }

    @Override
    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    @Override
    public List<ApplicationDTO> findAllByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Application> applications = applicationRepository.findAllByUser(user);
        return applicationMapper.toApplicationDTOs(applications);
    }

    @Override
    public List<Application> findAllByApplicationStatus(ApplicationStatus applicationStatus) {
        return applicationRepository.findAllByApplicationStatus(applicationStatus);
    }

    @Override
    public List<Application> findAllByApplicationStatusIn(List<ApplicationStatus> applicationStatuses) {
        return applicationRepository.findAllByApplicationStatusIn(applicationStatuses);
    }

    @Override
    public Optional<Application> findById(Long id) {
        return applicationRepository.findById(id);
    }

    @Override
    public Optional<ApplicationDTO> findByIdWithPersonAndContact(Long id) {
        Optional<Application> applicationDTO = applicationRepository.findByIdWithPersonAndContact(id);
        return applicationDTO.map(applicationMapper::toApplicationDTO);
    }

    @Override
    public boolean existById(Long id) {
        return applicationRepository.existsById(id);
    }

    @Override
    public Application updateApplication(Application application) {
        Optional<Application> app = applicationRepository.findById(application.getId());

        if(app.isPresent()) {
            Application updatedApp = app.get();
            updatedApp.setApplicationStatus(application.getApplicationStatus());
            updatedApp.setMaritalStatus(application.getMaritalStatus());
            updatedApp.setPerson(application.getPerson());
            updatedApp.setParents(application.getParents());
            updatedApp.setSpouses(application.getSpouses());
            updatedApp.setChildren(application.getChildren());
            updatedApp.setSiblings(application.getSiblings());
            updatedApp.setReferees(application.getReferees());
            updatedApp.setRelatives(application.getRelatives());
            updatedApp.setBeneficiaries(application.getBeneficiaries());
            updatedApp.setSubmittedDate(application.getSubmittedDate());
            updatedApp.setApprovedDate(application.getApprovedDate());
            updatedApp.setRejectedDate(application.getRejectedDate());
            updatedApp.setNotes(application.getNotes());
            updatedApp.setRejectionReason(application.getRejectionReason());
            updatedApp.setAppUpdatedAt(LocalDateTime.now());

            var user = updatedApp.getUser();
            if(!(user.equals(application.getUser()))) {
                log.error("Saved user is not same as user in request.");
                //updatedApp.setUser(application.getUser());
            }

            return applicationRepository.save(updatedApp);
        } else {
            Optional<Application> newApplication = createApplication(application);
            if(newApplication.isPresent())
                return newApplication.get();
            else
                throw new NoSuchElementException("Application update failure");
        }
    }

    @Override
    public boolean deleteApplicationById(Long id) {
        try {
            applicationRepository.deleteById(id);
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    private Person createPersonFromRequest(PersonDTO request) {
        log.info("Create person from request: {}", request);
        Contact contact = Contact.builder().build();

        if(request.getContact() != null) {
            if (request.getContact().getAddresses() != null) {
                request.getContact().getAddresses().forEach(addressRequest -> {
                    log.info("Add address: {}", addressRequest);
                    Address address = Address.builder()
                            .addressType(addressRequest.getAddressType())
                            .street(addressRequest.getStreet())
                            .city(addressRequest.getCity())
                            .state(addressRequest.getState())
                            .zipcode(addressRequest.getZipcode())
                            .country(addressRequest.getCountry())
                            .build();
                    contact.addAddress(address);
                });
            }

            if (request.getContact().getEmails() != null) {
                request.getContact().getEmails().forEach(emailRequest -> {
                    log.info("Add email: {}", emailRequest);
                    Email email = Email.builder()
                            .emailType(emailRequest.getEmailType())
                            .address(emailRequest.getAddress())
                            .build();
                    contact.addEmail(email);
                });
            }

            if (request.getContact().getPhones() != null) {
                request.getContact().getPhones().forEach(phoneRequest -> {
                    log.info("Add phone: {}", phoneRequest);
                    Phone phone = Phone.builder()
                            .phoneType(phoneRequest.getPhoneType())
                            .number(phoneRequest.getNumber())
                            .countryCode(phoneRequest.getCountryCode())
                            .build();
                    contact.addPhone(phone);
                });
            }
        }

        log.info("Adding person details...firstName: {}", request.getFirstName());
        Person person = Person.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .middleName(request.getMiddleName())
                .dob(LocalDate.parse(request.getDob()))
                .lifeStatus(LifeStatus.LIVING)
                .contact(contact)
                .build();

        person.setContact(contact);
        return person;
    }

}
