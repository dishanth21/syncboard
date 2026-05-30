package com.syncboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.syncboard.entity.ActivityLog;

public interface ActivityLogRepository
        extends JpaRepository<
                ActivityLog,
                Long> {

}