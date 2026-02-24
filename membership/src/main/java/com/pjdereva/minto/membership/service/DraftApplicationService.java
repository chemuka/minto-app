package com.pjdereva.minto.membership.service;

import com.pjdereva.minto.membership.model.User;
import com.pjdereva.minto.membership.dto.application.ApplicationDTO;

public interface DraftApplicationService {
    ApplicationDTO saveDraft(User user, ApplicationDTO draft);
    ApplicationDTO loadDraft(Long userId);
    void deleteDraft(Long userId);
    ApplicationDTO submitDraft(User user, ApplicationDTO applicationDTO);
    ApplicationDTO updateApplication(User user, ApplicationDTO applicationDTO);
}
