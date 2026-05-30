package com.syncboard.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.syncboard.entity.Board;
import com.syncboard.service.BoardService;

@RestController
@RequestMapping("/api/v1/boards")
public class BoardController {

    private final BoardService boardService;

    public BoardController(
            BoardService boardService) {

        this.boardService =
                boardService;
    }

    @PostMapping
    public Board createBoard(
            @RequestBody Board board) {

        return boardService
                .createBoard(board);
    }

    @GetMapping
    public List<Board> getBoards() {

        return boardService
                .getBoards();
    }
}