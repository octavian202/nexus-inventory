package com.octavian.server.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

@RestController
@RequestMapping("/api/v1/meta")
public class MetaController {

    public record MetaResponse(String appName, Instant serverTime) {
    }

    @Value("${spring.application.name:nexus-inventory-server}")
    private String appName;

    @GetMapping
    public ResponseEntity<MetaResponse> getMeta() {
        return ResponseEntity.ok(new MetaResponse(appName, Instant.now()));
    }
}

