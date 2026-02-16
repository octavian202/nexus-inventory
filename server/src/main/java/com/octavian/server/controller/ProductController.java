package com.octavian.server.controller;

import com.octavian.server.dto.ProductCreateDTO;
import com.octavian.server.dto.ProductResponseDTO;
import com.octavian.server.dto.StockAdjustmentDTO;
import com.octavian.server.model.AuditActionType;
import com.octavian.server.model.StockMovementType;
import com.octavian.server.service.AuditLogService;
import com.octavian.server.service.ProductService;
import com.octavian.server.service.StockMovementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final StockMovementService stockMovementService;
    private final AuditLogService auditLogService;

    @PostMapping
    public ResponseEntity<ProductResponseDTO> createProduct(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody ProductCreateDTO dto) {
        ProductResponseDTO createdProduct = productService.createProduct(dto);
        if (jwt != null) {
            auditLogService.log(
                    jwt,
                    AuditActionType.PRODUCT_CREATED,
                    "PRODUCT",
                    createdProduct.id(),
                    "Created product " + createdProduct.sku() + " – " + createdProduct.name(),
                    null
            );
        }
        return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ProductResponseDTO>> getAllProducts() {
        List<ProductResponseDTO> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> getProductById(@PathVariable UUID id) {
        ProductResponseDTO product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    @PatchMapping("/{id}/stock")
    public ResponseEntity<ProductResponseDTO> updateStock(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID id,
            @Valid @RequestBody StockAdjustmentDTO dto) {
        ProductResponseDTO updatedProduct = stockMovementService.adjustStockWithAudit(
                id,
                dto.adjustment(),
                StockMovementType.ADJUSTMENT,
                null,
                null,
                "Manual adjustment",
                jwt
        );
        if (jwt != null) {
            auditLogService.log(
                    jwt,
                    AuditActionType.STOCK_ADJUSTMENT,
                    "PRODUCT",
                    id,
                    "Stock adjustment: " + (dto.adjustment() >= 0 ? "+" : "") + dto.adjustment() + " units",
                    "Manual adjustment"
            );
        }
        return ResponseEntity.ok(updatedProduct);
    }
}
