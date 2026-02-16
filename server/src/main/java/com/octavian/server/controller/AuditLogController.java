package com.octavian.server.controller;

import com.octavian.server.dto.AuditLogResponseDTO;
import com.octavian.server.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<List<AuditLogResponseDTO>> recent(@RequestParam(defaultValue = "50") int limit) {
        return ResponseEntity.ok(auditLogService.getRecentLogs(limit));
    }
}
