package com.octavian.server.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import io.swagger.v3.oas.annotations.media.Schema;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO for product response")
public class ProductResponseDTO {
    @Schema(description = "Unique identifier of the product", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID id;

    @Schema(description = "Stock Keeping Unit", example = "ELEC-GAM-001")
    private String sku;

    @Schema(description = "Product name", example = "Gaming Mouse")
    private String name;

    @Schema(description = "Product description", example = "High-precision wireless gaming mouse")
    private String description;

    @Schema(description = "Product category", example = "Electronics")
    private String category;

    @Schema(description = "Product price", example = "99.99")
    private BigDecimal price;

    @Schema(description = "Current stock quantity", example = "50")
    private Integer stockQuantity;

    @Schema(description = "Minimum stock level threshold", example = "10")
    private Integer minStockLevel;

    @Schema(description = "Flag indicating if the stock is below minimum level", example = "false")
    private boolean lowStockAlert;

    @Schema(description = "Timestamp when product was created")
    private LocalDateTime createdAt;

    @Schema(description = "Timestamp when product was last updated")
    private LocalDateTime updatedAt;
}
