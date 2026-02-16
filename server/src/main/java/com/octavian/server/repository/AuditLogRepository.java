package com.octavian.server.repository;

import com.octavian.server.model.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {

    @EntityGraph(attributePaths = {"user"})
    Page<AuditLog> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
