package com.syncboard.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.syncboard.entity.ActivityLog;
import com.syncboard.repository.ActivityLogRepository;

@Service
public class ActivityLogService {

    private final ActivityLogRepository repository;

    public ActivityLogService(
            ActivityLogRepository repository) {

        this.repository = repository;
    }

    public void createLog(
            String action,
            String email) {

        ActivityLog log =
                new ActivityLog();

        log.setAction(action);

        log.setUserEmail(email);

        log.setCreatedAt(
                LocalDateTime.now());

        repository.save(log);
    }
}