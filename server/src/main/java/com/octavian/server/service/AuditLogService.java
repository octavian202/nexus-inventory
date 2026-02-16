package com.octavian.server.service;

import com.octavian.server.dto.AuditLogResponseDTO;
import com.octavian.server.model.AuditActionType;
import com.octavian.server.model.AuditLog;
import com.octavian.server.model.User;
import com.octavian.server.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final UserService userService;

    /**
     * Log an action performed by the user identified by the JWT.
     */
    @Transactional
    public void log(
            org.springframework.security.oauth2.jwt.Jwt jwt,
            AuditActionType actionType,
            String entityType,
            UUID entityId,
            String description,
            String details
    ) {
        User user = userService.getOrCreateUserFromJwt(jwt);
        AuditLog log = AuditLog.builder()
                .user(user)
                .actionType(actionType)
                .entityType(entityType)
                .entityId(entityId)
                .description(description)
                .details(details != null && details.length() > 1000 ? details.substring(0, 1000) : details)
                .build();
        auditLogRepository.save(log);
    }

    @Transactional(readOnly = true)
    public List<AuditLogResponseDTO> getRecentLogs(int limit) {
        int safeLimit = Math.max(1, Math.min(limit, 200));
        return auditLogRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(0, safeLimit))
                .map(AuditLogService::toResponseDTO)
                .toList();
    }

    private static AuditLogResponseDTO toResponseDTO(AuditLog log) {
        return new AuditLogResponseDTO(
                log.getId(),
                log.getUser().getId(),
                log.getUser().getEmail(),
                log.getUser().getDisplayName(),
                log.getActionType(),
                log.getEntityType(),
                log.getEntityId(),
                log.getDescription(),
                log.getDetails(),
                log.getCreatedAt()
        );
    }
}
