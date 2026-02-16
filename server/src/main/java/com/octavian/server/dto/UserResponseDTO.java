package com.octavian.server.dto;

import java.time.Instant;
import java.util.UUID;

public record UserResponseDTO(
        UUID id,
        String authUserId,
        String email,
        String displayName,
        String avatarUrl,
        Instant createdAt,
        Instant lastLoginAt
) {
}

