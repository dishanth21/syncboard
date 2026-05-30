package com.syncboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.syncboard.entity.Board;

public interface BoardRepository
        extends JpaRepository<Board, Long> {

}
