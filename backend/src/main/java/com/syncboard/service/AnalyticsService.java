package com.syncboard.service;

import org.springframework.stereotype.Service;

import com.syncboard.dto.AnalyticsResponse;
import com.syncboard.repository.TaskRepository;

@Service
public class AnalyticsService {

    private final TaskRepository repository;

    public AnalyticsService(
            TaskRepository repository) {

        this.repository =
                repository;
    }

    public AnalyticsResponse getAnalytics() {

        long total =
                repository.count();

        long completed =
                repository.countByColumnId(
                        2L);

        double rate = 0;

        if(total > 0) {

            rate =
                    (completed * 100.0)
                            / total;
        }

        return new AnalyticsResponse(

                total,

                completed,

                rate
        );
    }
}