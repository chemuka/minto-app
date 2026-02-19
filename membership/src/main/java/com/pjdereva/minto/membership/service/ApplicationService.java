package com.pjdereva.minto.membership.service;

import com.pjdereva.minto.membership.model.transaction.Application;
import com.pjdereva.minto.membership.model.transaction.ApplicationStatus;
import com.pjdereva.minto.membership.dto.application.ApplicationDTO;

import java.util.List;
import java.util.Optional;

public interface ApplicationService {
    Application createApplicationForUser(Long userId);
    void addPeopleAndOtherInfo(ApplicationDTO request);
    void submitApplication(Long applicationId, Long userId);
    void setApplicationUnderReview(Long applicationId);
    void approveApplication(Long applicationId);
    void rejectApplication(Long applicationId, String reason);
    void withdrawApplication(Long applicationId, Long userId);

    Optional<Application> createApplication(Application application);
    Application saveApplication(Application application);
    List<Application> getAllApplications();
    List<ApplicationDTO> findAllByUser(Long userId);
    List<Application> findAllByApplicationStatus(ApplicationStatus applicationStatus);
    List<Application> findAllByApplicationStatusIn(List<ApplicationStatus> applicationStatuses);
    Optional<Application> findById(Long id);
    Optional<ApplicationDTO> findByIdWithPersonAndContact(Long applicationId);
    boolean existById(Long id);
    Application updateApplication(Application application);
    boolean deleteApplicationById(Long id);
}
