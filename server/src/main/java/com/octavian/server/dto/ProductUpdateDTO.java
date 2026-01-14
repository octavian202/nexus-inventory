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
@Schema(description = "DTO for updating an existing product")
public class ProductUpdateDTO {

    @NotBlank(message = "Name is mandatory")
    @Schema(description = "Product name", example = "Gaming Mouse Pro")
    private String name;

    @Schema(description = "Product description", example = "Updated description")
    private String description;

    @NotBlank(message = "Category is mandatory")
    @Schema(description = "Product category", example = "Electronics")
    private String category;

    @PositiveOrZero(message = "Price must be positive or zero")
    @Schema(description = "Product price", example = "89.99")
    private BigDecimal price;

    @Min(value = 0, message = "Minimum stock level cannot be negative")
    @Schema(description = "Minimum stock level for low stock alerts", example = "15")
    private Integer minStockLevel;
}
