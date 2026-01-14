package com.octavian.server.service;

import com.octavian.server.dto.ProductCreateDTO;
import com.octavian.server.dto.ProductResponseDTO;
import com.octavian.server.dto.ProductUpdateDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface ProductService {
    ProductResponseDTO createProduct(ProductCreateDTO productCreateDTO);

    Page<ProductResponseDTO> getAllProducts(Pageable pageable);

    ProductResponseDTO getProductById(UUID id);

    ProductResponseDTO updateProduct(UUID id, ProductUpdateDTO productUpdateDTO);

    ProductResponseDTO updateStock(UUID id, int adjustment);
}
