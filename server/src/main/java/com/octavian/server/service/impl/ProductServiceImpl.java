package com.octavian.server.service.impl;

import com.octavian.server.dto.ProductCreateDTO;
import com.octavian.server.dto.ProductResponseDTO;
import com.octavian.server.dto.ProductUpdateDTO;
import com.octavian.server.exception.DuplicateResourceException;
import com.octavian.server.exception.InsufficientStockException;
import com.octavian.server.exception.ResourceNotFoundException;
import com.octavian.server.model.Product;
import com.octavian.server.repository.ProductRepository;
import com.octavian.server.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Override
    @Transactional
    public ProductResponseDTO createProduct(ProductCreateDTO dto) {
        if (productRepository.existsBySku(dto.getSku())) {
            throw new DuplicateResourceException("Product with SKU " + dto.getSku() + " already exists.");
        }

        Product product = Product.builder()
                .sku(dto.getSku())
                .name(dto.getName())
                .description(dto.getDescription())
                .category(dto.getCategory())
                .price(dto.getPrice())
                .stockQuantity(dto.getStockQuantity() != null ? dto.getStockQuantity() : 0)
                .minStockLevel(dto.getMinStockLevel() != null ? dto.getMinStockLevel() : 5)
                .build();

        Product savedProduct = productRepository.save(product);
        return mapToResponseDTO(savedProduct);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponseDTO> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable)
                .map(this::mapToResponseDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponseDTO getProductById(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return mapToResponseDTO(product);
    }

    @Override
    @Transactional
    public ProductResponseDTO updateProduct(UUID id, ProductUpdateDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        // Update fields allowed
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setCategory(dto.getCategory());
        product.setPrice(dto.getPrice());
        if (dto.getMinStockLevel() != null) {
            product.setMinStockLevel(dto.getMinStockLevel());
        }

        Product updatedProduct = productRepository.save(product);
        return mapToResponseDTO(updatedProduct);
    }

    @Override
    @Transactional
    public ProductResponseDTO updateStock(UUID id, int adjustment) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        int newStock = product.getStockQuantity() + adjustment;
        if (newStock < 0) {
            throw new InsufficientStockException(
                    "Insufficient stock. Current: " + product.getStockQuantity() + ", Adjustment: " + adjustment);
        }

        product.setStockQuantity(newStock);
        Product updatedProduct = productRepository.save(product);
        return mapToResponseDTO(updatedProduct);
    }

    private ProductResponseDTO mapToResponseDTO(Product product) {
        boolean isLowStock = product.getStockQuantity() <= product.getMinStockLevel();

        return ProductResponseDTO.builder()
                .id(product.getId())
                .sku(product.getSku())
                .name(product.getName())
                .description(product.getDescription())
                .category(product.getCategory())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .minStockLevel(product.getMinStockLevel())
                .lowStockAlert(isLowStock)
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }
}
