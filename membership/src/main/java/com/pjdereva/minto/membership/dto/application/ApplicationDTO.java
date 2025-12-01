package com.pjdereva.minto.membership.dto.application;


import com.pjdereva.minto.membership.model.transaction.MaritalStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApplicationDTO {

    private Long applicationId;
    private String applicationNumber;
    private Long userId;
    private PersonDTO person;
    private MaritalStatus maritalStatus;
    private List<ParentDTO> parents;
    private List<SpouseDTO> spouses;
    private List<ChildDTO> children;
    private List<SiblingDTO> siblings;
    private List<RefereeDTO> referees;
    private List<RelativeDTO> relatives;
    private List<BeneficiaryDTO> beneficiaries;
    private String submittedDate;
    private String approvedDate;
    private String rejectedDate;
    private String notes;
    private String rejectionReason;
    private String appCreatedAt;
    private String appUpdatedAt;
    private boolean editable;
    private boolean approved;
    private boolean submitted;
}
