package com.syncboard.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.syncboard.dto.AnalyticsResponse;
import com.syncboard.service.AnalyticsService;

@RestController
@RequestMapping("/api/v1/analytics")
public class AnalyticsController {

    private final AnalyticsService service;

    public AnalyticsController(
            AnalyticsService service) {

        this.service = service;
    }

    @GetMapping
    public AnalyticsResponse getAnalytics() {

        return service.getAnalytics();
    }
}