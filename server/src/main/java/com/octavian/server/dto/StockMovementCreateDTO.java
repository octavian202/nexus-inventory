package com.octavian.server.dto;

import com.octavian.server.model.StockMovementType;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record StockMovementCreateDTO(
        @NotNull(message = "productId is mandatory")
        UUID productId,
        @NotNull(message = "type is mandatory")
        StockMovementType type,
        @NotNull(message = "adjustment is mandatory")
        Integer adjustment,
        String fromBusiness,
        String toBusiness,
        String note
) {
}

