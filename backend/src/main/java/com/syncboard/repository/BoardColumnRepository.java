package com.syncboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.syncboard.entity.BoardColumn;

public interface BoardColumnRepository
        extends JpaRepository<
                BoardColumn,
                Long> {

}