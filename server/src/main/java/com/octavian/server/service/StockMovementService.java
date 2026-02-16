package com.octavian.server.service;

import com.octavian.server.dto.ProductResponseDTO;
import com.octavian.server.dto.StockMovementCreateDTO;
import com.octavian.server.dto.StockMovementResponseDTO;
import com.octavian.server.model.Product;
import com.octavian.server.model.StockMovement;
import com.octavian.server.model.StockMovementType;
import com.octavian.server.model.User;
import com.octavian.server.repository.ProductRepository;
import com.octavian.server.repository.StockMovementRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StockMovementService {

    private final ProductRepository productRepository;
    private final StockMovementRepository stockMovementRepository;
    private final UserService userService;

    @Transactional
    public StockMovementResponseDTO createMovement(StockMovementCreateDTO dto, Jwt jwt) {
        User performedBy = jwt != null ? userService.getOrCreateUserFromJwt(jwt) : null;
        return adjustStockWithAuditMovement(
                dto.productId(),
                dto.adjustment(),
                dto.type(),
                dto.fromBusiness(),
                dto.toBusiness(),
                dto.note(),
                performedBy
        );
    }

    @Transactional
    public StockMovementResponseDTO adjustStockWithAuditMovement(
            UUID productId,
            int adjustment,
            StockMovementType type,
            String fromBusiness,
            String toBusiness,
            String note,
            User performedBy
    ) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + productId));

        int newStock = product.getStockQuantity() + adjustment;
        if (newStock < 0) {
            throw new IllegalArgumentException(
                    "Stock adjustment would result in negative stock. Current: "
                            + product.getStockQuantity() + ", Adjustment: " + adjustment);
        }

        product.setStockQuantity(newStock);
        Product saved = productRepository.save(product);

        StockMovement movement = StockMovement.builder()
                .product(saved)
                .sku(saved.getSku())
                .productName(saved.getName())
                .type(type)
                .adjustment(adjustment)
                .resultingStock(newStock)
                .fromBusiness(blankToNull(fromBusiness))
                .toBusiness(blankToNull(toBusiness))
                .note(blankToNull(note))
                .performedBy(performedBy)
                .build();

        StockMovement stored = stockMovementRepository.save(movement);

        return toResponseDTO(stored);
    }

    @Transactional
    public ProductResponseDTO adjustStockWithAudit(
            UUID productId,
            int adjustment,
            StockMovementType type,
            String fromBusiness,
            String toBusiness,
            String note,
            Jwt jwt
    ) {
        User performedBy = jwt != null ? userService.getOrCreateUserFromJwt(jwt) : null;
        adjustStockWithAuditMovement(productId, adjustment, type, fromBusiness, toBusiness, note, performedBy);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + productId));
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

    @Transactional(readOnly = true)
    public List<StockMovementResponseDTO> getRecentMovements(int limit) {
        int safeLimit = Math.max(1, Math.min(limit, 200));
        return stockMovementRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(0, safeLimit))
                .map(StockMovementService::toResponseDTO)
                .toList();
    }

    private static StockMovementResponseDTO toResponseDTO(StockMovement m) {
        return new StockMovementResponseDTO(
                m.getId(),
                m.getProduct().getId(),
                m.getSku(),
                m.getProductName(),
                m.getType(),
                m.getAdjustment(),
                m.getResultingStock(),
                m.getFromBusiness(),
                m.getToBusiness(),
                m.getNote(),
                m.getPerformedBy() != null ? m.getPerformedBy().getId() : null,
                m.getPerformedBy() != null ? m.getPerformedBy().getEmail() : null,
                m.getCreatedAt()
        );
    }

    private static String blankToNull(String s) {
        if (s == null) return null;
        String t = s.trim();
        return t.isBlank() ? null : t;
    }
}

