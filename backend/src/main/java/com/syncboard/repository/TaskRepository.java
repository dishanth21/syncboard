package com.syncboard.repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.syncboard.entity.Task;

public interface TaskRepository
        extends JpaRepository<Task, Long> {
            Optional<Task> findById(Long id);
        long countByColumnId(
        Long columnId);

}