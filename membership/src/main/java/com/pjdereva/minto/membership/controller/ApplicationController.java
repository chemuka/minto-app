package com.pjdereva.minto.membership.controller;

import com.pjdereva.minto.membership.exception.ApplicationIdNotFoundException;
import com.pjdereva.minto.membership.mapper.ApplicationMapper;
import com.pjdereva.minto.membership.model.User;
import com.pjdereva.minto.membership.model.transaction.Application;
import com.pjdereva.minto.membership.model.transaction.ApplicationStatus;
import com.pjdereva.minto.membership.dto.application.ApplicationDTO;
import com.pjdereva.minto.membership.service.impl.ApplicationServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "${frontend.url}")
@RequestMapping("/api/v1/applications")
public class ApplicationController {

    private final ApplicationServiceImpl applicationService;
    private final ApplicationMapper applicationMapper;

    @GetMapping
    public ResponseEntity<List<Application>> getAllApplications() {
        List<Application> applications = applicationService.getAllApplications();
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/dto")
    public ResponseEntity<List<ApplicationDTO>> getAllApplicationsDTO() {
        List<Application> applications = applicationService.getAllApplications();
        return ResponseEntity.ok(applicationMapper.toApplicationDTOs(applications));
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<?> getApplicationById(@PathVariable Long id) {
        var application = applicationService.findById(id);
        return application.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseThrow(() -> new ApplicationIdNotFoundException(id));
    }

    @GetMapping("/dto/id/{id}")
    public ResponseEntity<?> getApplicationDTOById(@PathVariable Long id) {
        var application = applicationService.findById(id);
        return application.map(value -> new ResponseEntity<>(applicationMapper.toApplicationDTO(value), HttpStatus.OK))
                .orElseThrow(() -> new ApplicationIdNotFoundException(id));
    }

    // TODO: Fix repository SQL
    @GetMapping("/person/{id}")
    public ResponseEntity<?> getApplicationByIdWithPersonAndContact(@PathVariable Long id) {
        var applicationDTO = applicationService.findByIdWithPersonAndContact(id);
        return applicationDTO.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseThrow(() -> new ApplicationIdNotFoundException(id));
    }

    @GetMapping("/status/{appStatus}")
    public ResponseEntity<List<ApplicationDTO>> getAllByApplicationStatus(
            @PathVariable String appStatus
    ) {
        List<Application> applications = applicationService.findAllByApplicationStatus(ApplicationStatus.fromLabel(appStatus));
        return ResponseEntity.ok(applicationMapper.toApplicationDTOs(applications));
    }

    @GetMapping("/status/in/{appStatuses}")
    public ResponseEntity<List<ApplicationDTO>> getAllByApplicationStatusIn(
            @PathVariable List<String> appStatuses
    ) {
        List<ApplicationStatus> statuses = appStatuses.stream()
                .map(ApplicationStatus::fromLabel)
                .toList();
        List<Application> applications = applicationService.findAllByApplicationStatusIn(statuses);
        return ResponseEntity.ok(applicationMapper.toApplicationDTOs(applications));
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

    @PatchMapping
    public ResponseEntity<?> updateApplication(@RequestBody ApplicationDTO applicationDTO) {
        var application = applicationMapper.toApplication(applicationDTO);
        var app = applicationService.updateApplication(application);
        return ResponseEntity.ok(applicationMapper.toApplicationDTO(app));
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
            app = applicationService.createApplicationForUser(applicationDTO.getUser().getId());
        } catch (Exception e) {
            return ResponseEntity.unprocessableEntity().body(e.getMessage());
        }
        return ResponseEntity.ok(applicationMapper.toApplicationDTO(app));
    }

    @PostMapping("/add-people")
    public ResponseEntity<?> addPeopleAndOtherInfo(@RequestBody ApplicationDTO applicationDTO) {
        try {
            log.info("applicationDTO: {}", applicationDTO);
            applicationService.addPeopleAndOtherInfo(applicationDTO);
        } catch (Exception e) {
            log.error("Add people failed: {}", e.getMessage());
            return ResponseEntity.unprocessableEntity().body(e.getMessage());
        }
        return ResponseEntity.ok("Family members, referees and beneficiaries added to application " +
                applicationDTO.getApplicationNumber());
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitApplication(@RequestBody ApplicationDTO applicationDTO) {
        try {
            applicationService.submitApplication(applicationDTO.getId(),
                    applicationDTO.getUser().getId());
        } catch (Exception e) {
            return ResponseEntity.unprocessableEntity().body(e.getMessage());
        }
        return ResponseEntity.ok("Application " + applicationDTO.getApplicationNumber() +
                " submitted successfully.");
    }

    @PostMapping("/review")
    public ResponseEntity<?> setApplicationUnderReview(
            @RequestBody ApplicationDTO applicationDTO,
            Principal currentUser
    ) {
        // TODO: Fix authorization using security configuration
        var user = (User) ((UsernamePasswordAuthenticationToken) currentUser).getPrincipal();

        try {
            if(user.isAdmin() || user.isStaff()) {
                applicationService.setApplicationUnderReview(applicationDTO.getId());
                return ResponseEntity.ok("Application: " + applicationDTO.getApplicationNumber()  +
                        ", is now under review.");
            } else {
                return ResponseEntity.ok("User: " + user.getFirstName() + " " + user.getLastName() +
                        ", has insufficient access to review application.");
            }
        } catch (Exception e) {
            return ResponseEntity.unprocessableEntity().body(e.getMessage());
        }
    }

    @PostMapping("/approve")
    public ResponseEntity<?> approveApplication(
            @RequestBody ApplicationDTO applicationDTO,
            Principal currentUser
    ) {
        // TODO: Fix authorization using security configuration
        var user = (User) ((UsernamePasswordAuthenticationToken) currentUser).getPrincipal();

        try {
            if(user.isAdmin() || user.isStaff()) {
                applicationService.approveApplication(applicationDTO.getId());
            } else {
                return ResponseEntity.ok("User: " + user.getFirstName() + " " + user.getLastName() +
                        ", has insufficient access to approve application.");
            }
            //app = applicationService.createApplicationForUser(application.getUser().getId());
        } catch (Exception e) {
            return ResponseEntity.unprocessableEntity().body(e.getMessage());
        }
        return ResponseEntity.ok("Application: " + applicationDTO.getApplicationNumber() +
                ", approved by " + user.getFirstName() + " " + user.getLastName() + ".");
    }

    @PostMapping("/reject")
    public ResponseEntity<?> rejectApplication(
            @RequestBody ApplicationDTO applicationDTO,
            Principal currentUser
    ) {
        // TODO: Fix authorization using security configuration
        var user = (User) ((UsernamePasswordAuthenticationToken) currentUser).getPrincipal();

        try {
            if(user.isAdmin() || user.isStaff()) {
                applicationService.rejectApplication(applicationDTO.getId(),
                        applicationDTO.getRejectionReason());
            } else {
                return ResponseEntity.ok("User: " + user.getFirstName() + " " + user.getLastName() +
                        ", has insufficient access to reject application.");
            }
        } catch (Exception ex) {
            return ResponseEntity.unprocessableEntity().body(ex.getMessage());
        }
        return ResponseEntity.ok("Application: " + applicationDTO.getApplicationNumber() +
                " rejected for the following reason: " + applicationDTO.getRejectionReason());
    }

    @PostMapping("/return")
    public ResponseEntity<?> returnApplication(
            @RequestBody ApplicationDTO applicationDTO,
            Principal currentUser
    ) {
        // TODO: Fix authorization using security configuration
        var user = (User) ((UsernamePasswordAuthenticationToken) currentUser).getPrincipal();

        try {
            if(user.isAdmin() || user.isStaff()) {
                applicationService.returnApplication(applicationDTO.getId(),
                        applicationDTO.getNotes());
            } else {
                return ResponseEntity.ok("User: " + user.getFirstName() + " " + user.getLastName() +
                        ", has insufficient access to return application.");
            }
        } catch (Exception ex) {
            return ResponseEntity.unprocessableEntity().body(ex.getMessage());
        }
        return ResponseEntity.ok("Application: " + applicationDTO.getApplicationNumber() +
                " returned for the following reason: " + applicationDTO.getNotes());
    }

    @PostMapping("/withdraw")
    public ResponseEntity<?> withdrawApplication(@RequestBody ApplicationDTO applicationDTO) {
        try {
            applicationService.withdrawApplication(applicationDTO.getId(),
                    applicationDTO.getUser().getId());
        } catch (Exception e) {
            return ResponseEntity.unprocessableEntity().body(e.getMessage());
        }
        return ResponseEntity.ok("Application: " + applicationDTO.getApplicationNumber() +
                ", withdrawn by the user.");
    }

}
