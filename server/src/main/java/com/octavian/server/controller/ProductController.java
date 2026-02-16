package com.octavian.server.controller;

import com.octavian.server.dto.ProductCreateDTO;
import com.octavian.server.dto.ProductResponseDTO;
import com.octavian.server.dto.StockAdjustmentDTO;
import com.octavian.server.model.StockMovementType;
import com.octavian.server.service.ProductService;
import com.octavian.server.service.StockMovementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final StockMovementService stockMovementService;

    @PostMapping
    public ResponseEntity<ProductResponseDTO> createProduct(@Valid @RequestBody ProductCreateDTO dto) {
        ProductResponseDTO createdProduct = productService.createProduct(dto);
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
            @PathVariable UUID id,
            @Valid @RequestBody StockAdjustmentDTO dto) {
        ProductResponseDTO updatedProduct = stockMovementService.adjustStockWithAudit(
                id,
                dto.adjustment(),
                StockMovementType.ADJUSTMENT,
                null,
                null,
                "Manual adjustment"
        );
        return ResponseEntity.ok(updatedProduct);
    }
}
