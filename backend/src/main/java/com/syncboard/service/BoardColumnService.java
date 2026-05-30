package com.syncboard.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.syncboard.entity.BoardColumn;
import com.syncboard.repository.BoardColumnRepository;

@Service
public class BoardColumnService {

    private final BoardColumnRepository repository;

    public BoardColumnService(
            BoardColumnRepository repository) {

        this.repository = repository;
    }

    public BoardColumn createColumn(
            BoardColumn column) {

        return repository.save(
                column);
    }

    public List<BoardColumn> getColumns() {

        return repository.findAll();
    }

    public BoardColumn getColumnById(Long columnId) {
        return repository.findById(columnId)
                .orElseThrow(() ->
                    new RuntimeException(
                        "Column not found"));
    }

    public BoardColumn updateColumn(Long columnId, BoardColumn columnDetails) {
        BoardColumn column = getColumnById(columnId);
        
        if (columnDetails.getName() != null) {
            column.setName(columnDetails.getName());
        }
        
        return repository.save(column);
    }

    public void deleteColumn(Long columnId) {
        repository.deleteById(columnId);
    }
}