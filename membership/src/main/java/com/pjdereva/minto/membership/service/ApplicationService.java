package com.pjdereva.minto.membership.service;

import com.pjdereva.minto.membership.model.transaction.Application;
import com.pjdereva.minto.membership.model.transaction.ApplicationStatus;

import java.util.List;
import java.util.Optional;

public interface ApplicationService {

    Optional<Application> createApplication(Application application);
    Application saveApplication(Application application);
    List<Application> getAllApplications();
    Optional<Application> getApplicationById(Long id);
    List<Application> findAllByApplicationStatus(ApplicationStatus applicationStatus);
    boolean existById(Long id);
    Application updateApplication(Application application);
    boolean deleteApplicationById(Long id);
}
