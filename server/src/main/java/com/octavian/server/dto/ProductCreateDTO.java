package com.octavian.server.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record ProductCreateDTO(
        @NotBlank(message = "SKU is mandatory")
        String sku,
        @NotBlank(message = "Name is mandatory")
        String name,
        String category,
        @NotNull(message = "Price is mandatory")
        @DecimalMin(value = "0.0", inclusive = true, message = "Price must be zero or greater")
        BigDecimal price,
        @Min(value = 0, message = "Stock quantity cannot be negative")
        Integer stockQuantity,
        @Min(value = 0, message = "Minimum stock level cannot be negative")
        Integer minStockLevel
) {
}
