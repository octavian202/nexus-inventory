package com.octavian.server.controller;

import com.octavian.server.dto.StockMovementCreateDTO;
import com.octavian.server.dto.StockMovementResponseDTO;
import com.octavian.server.model.AuditActionType;
import com.octavian.server.service.AuditLogService;
import com.octavian.server.service.StockMovementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/stock-movements")
@RequiredArgsConstructor
public class StockMovementController {

    private final StockMovementService stockMovementService;
    private final AuditLogService auditLogService;

    @PostMapping
    public ResponseEntity<StockMovementResponseDTO> create(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody StockMovementCreateDTO dto) {
        StockMovementResponseDTO created = stockMovementService.createMovement(dto, jwt);
        if (jwt != null) {
            AuditActionType auditType = switch (dto.type()) {
                case RECEIVING -> AuditActionType.STOCK_RECEIVING;
                case TRANSFER -> AuditActionType.STOCK_TRANSFER;
                case ADJUSTMENT -> AuditActionType.STOCK_ADJUSTMENT;
            };
            String description = dto.type() + ": " + (dto.adjustment() >= 0 ? "+" : "") + dto.adjustment()
                    + " units for " + created.sku() + " – " + created.productName();
            auditLogService.log(
                    jwt,
                    auditType,
                    "STOCK_MOVEMENT",
                    created.id(),
                    description,
                    dto.note()
            );
        }
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<StockMovementResponseDTO>> recent(@RequestParam(defaultValue = "50") int limit) {
        return ResponseEntity.ok(stockMovementService.getRecentMovements(limit));
    }
}

