package com.pjdereva.minto.membership.controller;

import com.pjdereva.minto.membership.model.transaction.Application;
import com.pjdereva.minto.membership.model.transaction.ApplicationStatus;
import com.pjdereva.minto.membership.dto.application.ApplicationDTO;
import com.pjdereva.minto.membership.service.impl.ApplicationServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequiredArgsConstructor
@CrossOrigin("http://localhost:3000")
@RequestMapping("/api/v1/applications")
public class ApplicationController {

    private final ApplicationServiceImpl applicationService;

    @GetMapping
    public ResponseEntity<List<Application>> getAllApplications() {
        List<Application> applications = applicationService.getAllApplications();
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getApplicationById(@PathVariable Long id) {
        var application = applicationService.findById(id);
        return ResponseEntity.ok(application);
    }

    @GetMapping("/person/{id}")
    public ResponseEntity<?> getApplicationByIdWithPersonAndContact(@PathVariable Long id) {
        var application = applicationService.findByIdWithPersonAndContact(id);
        return ResponseEntity.ok(application);
    }

    @GetMapping("/app-status/{appStatus}")
    public ResponseEntity<List<Application>> getAllByApplicationStatus(
            @PathVariable String appStatus
    ) {
        List<Application> applications = applicationService.findAllByApplicationStatus(ApplicationStatus.fromLabel(appStatus));
        return ResponseEntity.ok(applications);
    }

    @PostMapping
    public ResponseEntity<?> createApplication(@RequestBody Application application) {
        Optional<Application> app = Optional.empty();
        try {
            app = applicationService.createApplication(application);
        } catch (Exception ex) {
            return ResponseEntity.unprocessableEntity().body(ex.getMessage());
        }
        return ResponseEntity.ok(app);
    }

    @PutMapping
    public ResponseEntity<?> updateApplication(@RequestBody Application application) {
        var app = applicationService.updateApplication(application);
        return ResponseEntity.ok(app);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteApplicationById(@PathVariable Long id) {
        if(!applicationService.existById(id)) {
            return ResponseEntity.badRequest()
                    .body("Error: Application with id: " + id + " does not exist.");
        }
        boolean response = false;
        try {
            response = applicationService.deleteApplicationById(id);
        } catch (RuntimeException e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
        if(response)
            return ResponseEntity.ok("Application with id " + id + " has been deleted successfully.");
        else
            return ResponseEntity.unprocessableEntity().body("Error: Something went wrong in the database!");
    }

    @PostMapping("/create")
    public ResponseEntity<?> createApplicationForUser(@RequestBody ApplicationDTO applicationDTO) {
        Application app = null;
        try {
            app = applicationService.createApplicationForUser(applicationDTO.getUserId());
        } catch (Exception e) {
            return ResponseEntity.ok(e.getMessage());
        }
        return ResponseEntity.ok(app);
    }

    @PostMapping("/add-people")
    public ResponseEntity<?> addPeopleAndOtherInfo(@RequestBody ApplicationDTO applicationDTO) {
        try {
            log.info("applicationDTO: {}", applicationDTO);
            applicationService.addPeopleAndOtherInfo(applicationDTO);
        } catch (Exception e) {
            log.error("Add people failed: {}", e.getMessage());
            return ResponseEntity.ok(e.getMessage());
        }
        return ResponseEntity.ok("Family members, referees and beneficiaries added to application " +
                applicationDTO.getApplicationNumber());
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitApplication(@RequestBody ApplicationDTO applicationDTO) {
        try {
            applicationService.submitApplication(applicationDTO.getApplicationId(),
                    applicationDTO.getUserId());
        } catch (Exception e) {
            return ResponseEntity.ok(e.getMessage());
        }
        return ResponseEntity.ok("Application " + applicationDTO.getApplicationNumber() +
                " submitted successfully.");
    }

    @PostMapping("/review")
    public ResponseEntity<?> setApplicationUnderReview(@RequestBody ApplicationDTO applicationDTO) {
        try {
            applicationService.setApplicationUnderReview(applicationDTO.getApplicationId());
        } catch (Exception e) {
            return ResponseEntity.ok(e.getMessage());
        }
        return ResponseEntity.ok("Application: " + applicationDTO.getApplicationNumber()  +
                ", is now under review.");
    }

    @PostMapping("/approve")
    public ResponseEntity<?> approveApplication(@RequestBody Application application) {
        Application app = null;
        try {
            app = applicationService.createApplicationForUser(application.getUser().getId());
        } catch (Exception e) {
            return ResponseEntity.ok(e.getMessage());
        }
        return ResponseEntity.ok(app);
    }

    @PostMapping("/reject")
    public ResponseEntity<?> rejectApplication(@RequestBody ApplicationDTO applicationDTO) {
        try {
            applicationService.rejectApplication(applicationDTO.getApplicationId(),
                    applicationDTO.getRejectionReason());
        } catch (Exception ex) {
            return ResponseEntity.ok(ex.getMessage());
        }
        return ResponseEntity.ok("Application: " + applicationDTO.getApplicationNumber() +
                " rejected for the following reason: " + applicationDTO.getRejectionReason());
    }

    @PostMapping("/withdraw")
    public ResponseEntity<?> withdrawApplication(@RequestBody ApplicationDTO applicationDTO) {
        try {
            applicationService.withdrawApplication(applicationDTO.getApplicationId(),
                    applicationDTO.getUserId());
        } catch (Exception e) {
            return ResponseEntity.ok(e.getMessage());
        }
        return ResponseEntity.ok("Application: " + applicationDTO.getApplicationNumber() +
                ", withdrawn by the user.");
    }

}
