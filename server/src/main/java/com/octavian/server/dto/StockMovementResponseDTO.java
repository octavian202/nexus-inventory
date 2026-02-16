package com.octavian.server.dto;

import com.octavian.server.model.StockMovementType;

import java.time.Instant;
import java.util.UUID;

public record StockMovementResponseDTO(
        UUID id,
        UUID productId,
        String sku,
        String productName,
        StockMovementType type,
        Integer adjustment,
        Integer resultingStock,
        String fromBusiness,
        String toBusiness,
        String note,
        UUID performedByUserId,
        String performedByEmail,
        Instant createdAt
) {
}

