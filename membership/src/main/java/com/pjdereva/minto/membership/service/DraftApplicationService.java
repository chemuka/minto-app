package com.pjdereva.minto.membership.service;

import com.pjdereva.minto.membership.model.User;
import com.pjdereva.minto.membership.model.transaction.Application;
import com.pjdereva.minto.membership.dto.application.ApplicationDTO;

public interface DraftApplicationService {
    Application saveDraft(User user, ApplicationDTO draft);
    ApplicationDTO loadDraft(Long userId);
    void deleteDraft(Long userId);

}
