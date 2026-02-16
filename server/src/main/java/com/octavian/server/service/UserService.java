package com.octavian.server.service;

import com.octavian.server.dto.UserResponseDTO;
import com.octavian.server.model.User;
import com.octavian.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    /** Returns the app User entity for server-side use (e.g. audit log). */
    @Transactional(readOnly = false)
    public User getOrCreateUserFromJwt(Jwt jwt) {
        String authUserId = jwt.getSubject();
        String email = jwt.getClaimAsString("email");
        String name = jwt.getClaimAsString("name");
        String picture = jwt.getClaimAsString("picture");
        if ((name == null || name.isBlank()) || (picture == null || picture.isBlank())) {
            Map<String, Object> userMetadata = jwt.getClaim("user_metadata");
            if (userMetadata != null) {
                if (name == null || name.isBlank()) {
                    Object fn = userMetadata.get("full_name");
                    if (fn != null) name = fn.toString();
                }
                if (picture == null || picture.isBlank()) {
                    Object av = userMetadata.get("avatar_url");
                    if (av != null) picture = av.toString();
                }
            }
        }
        final String displayName = name;
        final String avatarUrl = picture;

        User user = userRepository.findByAuthUserId(authUserId)
                .map(existing -> {
                    existing.setEmail(email != null ? email : existing.getEmail());
                    if (displayName != null && !displayName.isBlank()) {
                        existing.setDisplayName(displayName);
                    }
                    if (avatarUrl != null && !avatarUrl.isBlank()) {
                        existing.setAvatarUrl(avatarUrl);
                    }
                    existing.setLastLoginAt(Instant.now());
                    return existing;
                })
                .orElseGet(() -> User.builder()
                        .authUserId(authUserId)
                        .email(email != null ? email : authUserId)
                        .displayName(displayName)
                        .avatarUrl(avatarUrl)
                        .lastLoginAt(Instant.now())
                        .build());

        return userRepository.save(user);
    }

    @Transactional
    public UserResponseDTO getOrCreateFromJwt(Jwt jwt) {
        User user = getOrCreateUserFromJwt(jwt);
        return toResponseDTO(user);
    }

    @Transactional(readOnly = true)
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserService::toResponseDTO)
                .toList();
    }

    private static UserResponseDTO toResponseDTO(User u) {
        return new UserResponseDTO(
                u.getId(),
                u.getAuthUserId(),
                u.getEmail(),
                u.getDisplayName(),
                u.getAvatarUrl(),
                u.getCreatedAt(),
                u.getLastLoginAt()
        );
    }
}

