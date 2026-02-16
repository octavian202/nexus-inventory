package com.octavian.server.controller;

import com.octavian.server.dto.StockMovementCreateDTO;
import com.octavian.server.dto.StockMovementResponseDTO;
import com.octavian.server.service.StockMovementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/stock-movements")
@RequiredArgsConstructor
public class StockMovementController {

    private final StockMovementService stockMovementService;

    @PostMapping
    public ResponseEntity<StockMovementResponseDTO> create(@Valid @RequestBody StockMovementCreateDTO dto) {
        StockMovementResponseDTO created = stockMovementService.createMovement(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<StockMovementResponseDTO>> recent(@RequestParam(defaultValue = "50") int limit) {
        return ResponseEntity.ok(stockMovementService.getRecentMovements(limit));
    }
}

