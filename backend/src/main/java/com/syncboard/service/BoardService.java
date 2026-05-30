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

    public Board getBoardById(Long boardId) {
        return boardRepository.findById(boardId)
                .orElseThrow(() ->
                    new RuntimeException(
                        "Board not found"));
    }

    public Board updateBoard(Long boardId, Board boardDetails) {
        Board board = getBoardById(boardId);
        
        if (boardDetails.getName() != null) {
            board.setName(boardDetails.getName());
        }
        if (boardDetails.getDescription() != null) {
            board.setDescription(boardDetails.getDescription());
        }
        
        return boardRepository.save(board);
    }

    public void deleteBoard(Long boardId) {
        boardRepository.deleteById(boardId);
    }
}