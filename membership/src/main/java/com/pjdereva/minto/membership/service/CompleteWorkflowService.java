package com.pjdereva.minto.membership.service;

import com.pjdereva.minto.membership.dto.AddUserDTO;
import com.pjdereva.minto.membership.dto.UserDto;
import com.pjdereva.minto.membership.mapper.UserMapper;
import com.pjdereva.minto.membership.model.User;
import com.pjdereva.minto.membership.model.transaction.Application;
import com.pjdereva.minto.membership.model.transaction.MaritalStatus;
import com.pjdereva.minto.membership.model.transaction.Member;
import com.pjdereva.minto.membership.payload.response.WorkflowResult;
import com.pjdereva.minto.membership.repository.ApplicationRepository;
import com.pjdereva.minto.membership.repository.MemberRepository;
import com.pjdereva.minto.membership.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Optional;

/**
 * Complete workflow: User Registration → Application → Member
 * NEW FLOW: User account created FIRST
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CompleteWorkflowService {

    private final UserService userService;
    private final ApplicationService applicationService;
    private final MemberService memberService;
    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    private final MemberRepository memberRepository;
    private final UserMapper userMapper;

    /**
     * COMPLETE WORKFLOW DEMONSTRATION
     */
/*    @Transactional
    public WorkflowResult executeCompleteWorkflow() {
        WorkflowResult result = new WorkflowResult();

        try {
            // ===================================================================
            // STEP 1: User Registration (starts as GUEST)
            // ===================================================================
            log.info("=== STEP 1: User Registration ===");

            User signUpUser = User.builder()
                    .firstName("John")
                    .lastName("Doe")
                    .email("john.doe@example.com")
                    .password("SecurePass123!")
                    .build();

            //AddUserDTO addUserDTO = UserMapper.INSTANCE.toAddUserDTO(signUpUser);
            AddUserDTO addUserDTO = userMapper.toAddUserDTO(signUpUser);

            UserDto userDto = userService.createGuestUser(addUserDTO);
            //User user = UserMapper.INSTANCE.toUser(userDto);
            User user = userMapper.toUser(userDto);
            result.setUserId(user.getId());
            result.setEmail(user.getEmail());
            result.setUserRole("ROLE_GUEST");

            log.info("✓ User registered: {} with ROLE_GUEST", user.getEmail());

            // ===================================================================
            // STEP 3: User Creates Application
            // ===================================================================
            log.info("=== STEP 3: User Creates Application ===");

            Application application = applicationService.createApplicationForUser(user.getId());
            result.setApplicationId(application.getId());
            result.setApplicationNumber(application.getApplicationNumber());
            result.setApplicationStatus("DRAFT");

            log.info("✓ Application created: {}", application.getApplicationNumber());

            // Add family members (simplified for demo)
            application.setMaritalStatus(MaritalStatus.MARRIED);
            applicationRepository.save(application);

            // ===================================================================
            // STEP 4: User Submits Application
            // ===================================================================
            log.info("=== STEP 4: User Submits Application ===");

            applicationService.submitApplication(application.getId(), user.getId());
            application = applicationRepository.findById(application.getId()).orElseThrow();
            result.setApplicationStatus("SUBMITTED");

            log.info("✓ Application submitted: {}", application.getApplicationNumber());

            // ===================================================================
            // STEP 5: Staff Reviews Application
            // ===================================================================
            log.info("=== STEP 5: Staff Reviews Application ===");

            applicationService.setApplicationUnderReview(application.getId());
            application = applicationRepository.findById(application.getId()).orElseThrow();
            result.setApplicationStatus("UNDER_REVIEW");

            log.info("✓ Application under review");

            // ===================================================================
            // STEP 6: Staff Approves Application
            // ===================================================================
            log.info("=== STEP 6: Staff Approves Application ===");

            applicationService.approveApplication(application.getId());
            application = applicationRepository.findById(application.getId()).orElseThrow();
            result.setApplicationStatus("APPROVED");

            log.info("✓ Application approved");

            // ===================================================================
            // STEP 7: Create Member & Upgrade User to MEMBER Role
            // ===================================================================
            log.info("=== STEP 7: Create Member & Upgrade User ===");

            Member member = memberService.createMemberFromApplication(application.getId());
            result.setMemberId(member.getId());
            result.setMembershipNumber(member.getMembershipNumber());
            result.setMembershipStatus("ACTIVE");

            // Check user role upgrade
            user = userRepository.findById(user.getId()).orElseThrow();
            result.setUserRole("ROLE_MEMBER");
            result.setUserIsMember(true);

            log.info("✓ Member created: {}", member.getMembershipNumber());
            log.info("✓ User upgraded from GUEST to MEMBER role");

            // ===================================================================
            // STEP 8: Activate Member (Payment & Orientation)
            // ===================================================================
            log.info("=== STEP 8: Activate Member ===");

            memberService.activateMember(member.getId());
            member = memberRepository.findById(member.getId()).orElseThrow();

            log.info("✓ Member fully activated with payment and orientation");

            // ===================================================================
            // SUCCESS
            // ===================================================================
            result.setSuccess(true);
            result.setMessage("Complete workflow executed successfully!");

            log.info("=== WORKFLOW COMPLETED SUCCESSFULLY ===");
            log.info("User: {} ({})", user.getUsername(), user.getRole());
            log.info("Application: {} ({})", application.getApplicationNumber(), application.getApplicationStatus());
            log.info("Member: {} ({})", member.getMembershipNumber(), member.getStatus());

        } catch (Exception e) {
            result.setSuccess(false);
            result.setMessage("Workflow failed: " + e.getMessage());
            log.error("Workflow failed", e);
        }

        return result;
    }
    */
}
