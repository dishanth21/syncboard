package com.syncboard.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.syncboard.entity.Board;
import com.syncboard.repository.BoardRepository;

@Service
public class BoardService {

    private final BoardRepository boardRepository;

    public BoardService(
            BoardRepository boardRepository) {

        this.boardRepository =
                boardRepository;
    }

    public Board createBoard(
            Board board) {

        return boardRepository
                .save(board);
    }

    public List<Board> getBoards() {

        return boardRepository
                .findAll();
    }
}