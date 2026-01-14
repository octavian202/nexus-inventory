package com.octavian.server.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

import io.swagger.v3.oas.annotations.media.Schema;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO for creating a new product")
public class ProductCreateDTO {

    @NotBlank(message = "SKU is mandatory")
    @Schema(description = "Unique Stock Keeping Unit", example = "ELEC-GAM-001")
    private String sku;

    @NotBlank(message = "Name is mandatory")
    @Schema(description = "Product name", example = "Gaming Mouse")
    private String name;

    @Schema(description = "Detailed description of the product", example = "High-precision wireless gaming mouse")
    private String description;

    @NotBlank(message = "Category is mandatory")
    @Schema(description = "Product category", example = "Electronics")
    private String category;

    @PositiveOrZero(message = "Price must be positive or zero")
    @Schema(description = "Product price", example = "99.99")
    private BigDecimal price;

    @Min(value = 0, message = "Stock quantity cannot be negative")
    @Schema(description = "Initial stock quantity", example = "50")
    private Integer stockQuantity;

    @Min(value = 0, message = "Minimum stock level cannot be negative")
    @Schema(description = "Minimum stock level for low stock alerts", example = "10")
    private Integer minStockLevel;
}
