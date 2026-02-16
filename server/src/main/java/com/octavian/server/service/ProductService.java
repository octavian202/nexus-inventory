package com.octavian.server.service;

import com.octavian.server.dto.ProductCreateDTO;
import com.octavian.server.dto.ProductResponseDTO;
import com.octavian.server.exception.DuplicateResourceException;
import com.octavian.server.model.Product;
import com.octavian.server.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {

    private static final int DEFAULT_MIN_STOCK_LEVEL = 5;

    private final ProductRepository productRepository;

    @Transactional
    public ProductResponseDTO createProduct(ProductCreateDTO dto) {
        if (productRepository.existsBySku(dto.sku())) {
            throw new DuplicateResourceException("Product with SKU " + dto.sku() + " already exists.");
        }

        Product product = Product.builder()
                .sku(dto.sku())
                .name(dto.name())
                .category(dto.category())
                .price(dto.price())
                .stockQuantity(dto.stockQuantity() != null ? dto.stockQuantity() : 0)
                .minStockLevel(dto.minStockLevel() != null ? dto.minStockLevel() : DEFAULT_MIN_STOCK_LEVEL)
                .build();

        Product saved = productRepository.save(product);
        return toResponseDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(ProductService::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductResponseDTO getProductById(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));
        return toResponseDTO(product);
    }

    @Transactional
    public ProductResponseDTO updateStock(UUID id, int adjustment) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));

        int newStock = product.getStockQuantity() + adjustment;
        if (newStock < 0) {
            throw new IllegalArgumentException(
                    "Stock adjustment would result in negative stock. Current: "
                            + product.getStockQuantity() + ", Adjustment: " + adjustment);
        }

        product.setStockQuantity(newStock);
        Product saved = productRepository.save(product);
        return toResponseDTO(saved);
    }

    private static ProductResponseDTO toResponseDTO(Product product) {
        return new ProductResponseDTO(
                product.getId(),
                product.getSku(),
                product.getName(),
                product.getCategory(),
                product.getPrice(),
                product.getStockQuantity(),
                product.getMinStockLevel()
        );
    }
}
