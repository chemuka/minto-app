package com.pjdereva.minto.membership.service.impl;

import com.pjdereva.minto.membership.model.*;
import com.pjdereva.minto.membership.model.transaction.*;
import com.pjdereva.minto.membership.payload.request.application.*;
import com.pjdereva.minto.membership.repository.ApplicationRepository;
import com.pjdereva.minto.membership.repository.PersonRepository;
import com.pjdereva.minto.membership.repository.UserRepository;
import com.pjdereva.minto.membership.service.ApplicationService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
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
            throw new IllegalStateException("User has no person record");
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

    /**
     * Add family members, relatives, referees and beneficiaries to application
     */
    @Transactional
    public void addFamilyAndOthers(Long applicationId, Long userId, ApplicationRequest request) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        // Verify ownership and editable
        if (!application.getUser().getId().equals(userId)) {
            throw new SecurityException("User does not own this application");
        }
        if (!application.isEditable()) {
            throw new IllegalStateException("Application cannot be edited");
        }

        // Add parents
        if (request.getParents() != null) {
            request.getParents().forEach(parentReq -> {
                Person parentPerson = createPersonFromRequest(parentReq);
                Parent parent = Parent.builder()
                        .person(parentPerson)
                        .parentType(parentReq.getParentType())
                        .build();
                application.addParent(parent);
            });
        }

        // Add spouses
        if (request.getSpouses() != null) {
            request.getSpouses().forEach(spouseReq -> {
                Person spousePerson = createPersonFromRequest(spouseReq);
                Spouse spouse = Spouse.builder()
                        .person(spousePerson)
                        .maritalStatus(spouseReq.getMaritalStatus())
                        .build();
                application.addSpouse(spouse);
            });
        }

        // Add children
        if (request.getChildren() != null) {
            request.getChildren().forEach(childReq -> {
                Person childPerson = createPersonFromRequest(childReq);
                Child child = Child.builder()
                        .person(childPerson)
                        .childType(childReq.getChildType())
                        .build();
                application.addChild(child);
            });
        }

        // Add siblings
        if (request.getSiblings() != null) {
            request.getSiblings().forEach(siblingRequest -> {
                Person siblingPerson = createPersonFromRequest(siblingRequest);
                Sibling sibling = Sibling.builder()
                        .person(siblingPerson)
                        .siblingType(siblingRequest.getSiblingType())
                        .build();
                application.addSibling(sibling);
            });
        }

        // Add referees
        if (request.getReferees() != null) {
            request.getReferees().forEach(refereeRequest -> {
                Person refereePerson = createPersonFromRequest(refereeRequest);
                Referee referee = Referee.builder()
                        .person(refereePerson)
                        .membershipNumber(refereeRequest.getMembershipNumber())
                        .build();
                application.addReferee(referee);
            });
        }

        // Add relatives
        if (request.getRelatives() != null) {
            request.getRelatives().forEach(relativeRequest -> {
                Person relativePerson = createPersonFromRequest(relativeRequest);
                Relative relative = Relative.builder()
                        .person(relativePerson)
                        .membershipNumber(relativeRequest.getMembershipNumber())
                        .relationship(relativeRequest.getRelationship())
                        .build();
                application.addRelative(relative);
            });
        }

        // Add beneficiaries
        if (request.getBeneficiaries() != null) {
            request.getBeneficiaries().forEach(beneficiaryRequest -> {
                Person beneficiaryPerson = createPersonFromRequest(beneficiaryRequest);
                Beneficiary beneficiary = Beneficiary.builder()
                        .person(beneficiaryPerson)
                        .relationship(beneficiaryRequest.getRelationship())
                        .percentage(beneficiaryRequest.getPercentage())
                        .build();
                application.addBeneficiary(beneficiary);
            });
        }

        applicationRepository.save(application);
        log.info("Family members, referees and beneficiaries added to application {}",
                application.getApplicationNumber());
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
    public Optional<Application> getApplicationById(Long id) {
        return applicationRepository.findById(id);
    }

    @Override
    public List<Application> findAllByApplicationStatus(ApplicationStatus applicationStatus) {
        return applicationRepository.findAllByApplicationStatus(applicationStatus);
    }

    @Override
    public boolean existById(Long id) {
        return applicationRepository.existsById(id);
    }

    @Override
    public Application updateApplication(Application application) {
        application.setAppUpdatedAt(LocalDateTime.now());
        return applicationRepository.save(application);
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

    private Person createPersonFromRequest(PersonRequest request) {
        Contact contact = Contact.builder().build();

        if(request.getContact() != null) {
            if (request.getContact().getAddresses() != null) {
                request.getContact().getAddresses().forEach(addressRequest -> {
                    Address address = Address.builder()
                            .type(addressRequest.getType())
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
                    Email email = Email.builder()
                            .type(emailRequest.getType())
                            .address(emailRequest.getAddress())
                            .build();
                    contact.addEmail(email);
                });
            }

            if (request.getContact().getPhones() != null) {
                request.getContact().getPhones().forEach(phoneRequest -> {
                    Phone phone = Phone.builder()
                            .type(phoneRequest.getType())
                            .number(phoneRequest.getNumber())
                            .countryCode(phoneRequest.getCountryCode())
                            .build();
                    contact.addPhone(phone);
                });
            }
        }

        Person person = Person.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .middleName(request.getMiddleName())
                .dob(request.getDob())
                .lifeStatus(LifeStatus.LIVING)
                .contact(contact)
                .build();

        person.setContact(contact);
        return person;
    }

}
