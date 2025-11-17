package com.pjdereva.minto.membership.controller;

import com.pjdereva.minto.membership.dto.MemberDTO;
import com.pjdereva.minto.membership.model.transaction.Application;
import com.pjdereva.minto.membership.model.transaction.ApplicationStatus;
import com.pjdereva.minto.membership.model.transaction.Member;
import com.pjdereva.minto.membership.service.impl.ApplicationServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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
        var application = applicationService.getApplicationById(id);
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
}
