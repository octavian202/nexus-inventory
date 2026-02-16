package com.octavian.server.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record ProductResponseDTO(
        UUID id,
        String sku,
        String name,
        String category,
        BigDecimal price,
        Integer stockQuantity,
        Integer minStockLevel
) {
}
