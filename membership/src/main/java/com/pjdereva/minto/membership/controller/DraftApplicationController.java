package com.pjdereva.minto.membership.controller;

import com.pjdereva.minto.membership.model.User;
import com.pjdereva.minto.membership.model.transaction.Application;
import com.pjdereva.minto.membership.dto.application.ApplicationDTO;
import com.pjdereva.minto.membership.payload.response.AutoSaveResponse;
import com.pjdereva.minto.membership.payload.response.DraftResponse;
import com.pjdereva.minto.membership.service.impl.DraftApplicationServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;

/**
 * REST Controller for draft application management
 * Allows users to save progress and resume later
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/applications/draft")
@RequiredArgsConstructor
public class DraftApplicationController {

    private final DraftApplicationServiceImpl draftApplicationService;

    /**
     * Save or update draft application
     * POST /api/v1/applications/draft
     */
    @PostMapping
    public ResponseEntity<DraftResponse> saveDraft(
            @RequestBody ApplicationDTO draft,
            Principal currentUser) {

        var user = (User) ((UsernamePasswordAuthenticationToken) currentUser).getPrincipal();

        log.info("Saving draft for user: {} {}", user.getFirstName(),user.getLastName());

        try {
            ApplicationDTO application = draftApplicationService.saveDraft(user, draft);

            DraftResponse response = DraftResponse.builder()
                    .success(true)
                    .message("Draft saved successfully")
                    .applicationId(application.getId())
                    .applicationNumber(application.getApplicationNumber())
                    .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error saving draft", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(DraftResponse.builder()
                            .success(false)
                            .message("Failed to save draft: " + e.getMessage())
                            .build());
        }
    }

    /**
     * Load draft application
     * GET /api/v1/applications/draft
     */
    @GetMapping
    public ResponseEntity<ApplicationDTO> loadDraft(
            Principal currentUser) {

        var user = (User) ((UsernamePasswordAuthenticationToken) currentUser).getPrincipal();

        log.info("Loading draft for user: {} {}", user.getFirstName(), user.getLastName());

        try {
            ApplicationDTO draft = draftApplicationService.loadDraft(user.getId());

            return ResponseEntity.ok(draft);

        } catch (Exception e) {
            log.error("Error loading draft", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Delete draft application
     * DELETE /api/v1/applications/draft
     */
    @DeleteMapping
    public ResponseEntity<DraftResponse> deleteDraft(Principal currentUser) {

        var user = (User) ((UsernamePasswordAuthenticationToken) currentUser).getPrincipal();

        log.info("Deleting draft for user: {} {}", user.getFirstName(), user.getLastName());

        try {
            draftApplicationService.deleteDraft(user.getId());

            return ResponseEntity.ok(DraftResponse.builder()
                    .success(true)
                    .message("Draft deleted successfully")
                    .build());

        } catch (Exception e) {
            log.error("Error deleting draft", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(DraftResponse.builder()
                            .success(false)
                            .message("Failed to delete draft: " + e.getMessage())
                            .build());
        }
    }

    /**
     * Auto-save endpoint (called periodically by frontend)
     * PUT /api/v1/applications/draft/autosave
     */
    @PutMapping("/autosave")
    public ResponseEntity<AutoSaveResponse> autoSave(
            @RequestBody ApplicationDTO draft,
            Principal currentUser) {

        var user = (User) ((UsernamePasswordAuthenticationToken) currentUser).getPrincipal();

        log.debug("Auto-saving draft for user: {} {}", user.getFirstName(), user.getLastName());

        try {
            ApplicationDTO application = draftApplicationService.saveDraft(user, draft);

            AutoSaveResponse response = AutoSaveResponse.builder()
                    .success(true)
                    .savedAt(LocalDateTime.now())
                    .applicationId(application.getId())
                    .applicationNumber(application.getApplicationNumber())
                    .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error auto-saving draft", e);
            return ResponseEntity.ok(AutoSaveResponse.builder()
                    .success(false)
                    .error(e.getMessage())
                    .build());
        }
    }

    /**
     * Submit draft application
     * POST /api/v1/applications/draft/submit
     */
    @PostMapping("/submit")
    public ResponseEntity<DraftResponse> submitDraft(
            @RequestBody ApplicationDTO applicationDTO,
            Principal currentUser
    ) {
        var user = (User) ((UsernamePasswordAuthenticationToken) currentUser).getPrincipal();

        log.info("Submitting draft for user: {} {}", user.getFirstName(),user.getLastName());

        try {
            ApplicationDTO application = draftApplicationService.submitDraft(user, applicationDTO);
            log.info("✓ Draft application submitted: {}", application.getApplicationNumber());

            DraftResponse response = DraftResponse.builder()
                    .success(true)
                    .message("Draft application submitted successfully")
                    .applicationId(application.getId())
                    .applicationNumber(application.getApplicationNumber())
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error saving draft application", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(DraftResponse.builder()
                            .success(false)
                            .message("Failed to submit draft application: " + e.getMessage())
                            .build());
        }
    }

    /**
     * update draft application
     * PATCH /api/v1/applications/draft
     */
    @PatchMapping
    public ResponseEntity<DraftResponse> updateApplication(
            @RequestBody ApplicationDTO draft,
            Principal currentUser) {

        var user = (User) ((UsernamePasswordAuthenticationToken) currentUser).getPrincipal();

        log.info("{}: {} {} is updating application.", user.getRole(), user.getFirstName(),user.getLastName());

        try {
            ApplicationDTO application = draftApplicationService.updateApplication(user, draft);

            DraftResponse response = DraftResponse.builder()
                    .success(true)
                    .message("Application updated successfully")
                    .applicationId(application.getId())
                    .applicationNumber(application.getApplicationNumber())
                    .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error updating application ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(DraftResponse.builder()
                            .success(false)
                            .message("Failed to update application: " + e.getMessage())
                            .build());
        }
    }
}
