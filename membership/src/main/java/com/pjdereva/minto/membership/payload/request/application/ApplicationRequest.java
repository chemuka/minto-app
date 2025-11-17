package com.pjdereva.minto.membership.payload.request.application;


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
public class ApplicationRequest {

    private PersonRequest person;
    private MaritalStatus maritalStatus;
    private List<ParentRequest> parents;
    private List<SpouseRequest> spouses;
    private List<ChildRequest> children;
    private List<SiblingRequest> siblings;
    private List<RefereeRequest> referees;
    private List<RelativeRequest> relatives;
    private List<BeneficiaryRequest> beneficiaries;
}
