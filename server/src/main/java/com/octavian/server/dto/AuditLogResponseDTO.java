package com.octavian.server.dto;

import com.octavian.server.model.AuditActionType;

import java.time.Instant;
import java.util.UUID;

public record AuditLogResponseDTO(
        UUID id,
        UUID userId,
        String userEmail,
        String userDisplayName,
        AuditActionType actionType,
        String entityType,
        UUID entityId,
        String description,
        String details,
        Instant createdAt
) {
}
