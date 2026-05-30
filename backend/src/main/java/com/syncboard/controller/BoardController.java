package com.syncboard.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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

    @GetMapping("/{boardId}")
    public Board getBoardById(
            @PathVariable Long boardId) {

        return boardService
                .getBoardById(boardId);
    }

    @PutMapping("/{boardId}")
    public Board updateBoard(
            @PathVariable Long boardId,
            @RequestBody Board board) {

        return boardService
                .updateBoard(boardId, board);
    }

    @DeleteMapping("/{boardId}")
    public void deleteBoard(
            @PathVariable Long boardId) {

        boardService.deleteBoard(boardId);
    }
}