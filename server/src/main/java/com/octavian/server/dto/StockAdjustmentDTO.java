package com.octavian.server.dto;

import jakarta.validation.constraints.NotNull;

public record StockAdjustmentDTO(
        @NotNull(message = "adjustment is mandatory")
        Integer adjustment
) {
}

