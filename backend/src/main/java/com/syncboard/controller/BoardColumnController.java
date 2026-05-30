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

import com.syncboard.entity.BoardColumn;
import com.syncboard.service.BoardColumnService;

@RestController
@RequestMapping("/api/v1/columns")
public class BoardColumnController {

    private final BoardColumnService service;

    public BoardColumnController(
            BoardColumnService service) {

        this.service = service;
    }

    @PostMapping
    public BoardColumn createColumn(
            @RequestBody BoardColumn column) {

        return service.createColumn(
                column);
    }

    @GetMapping
    public List<BoardColumn> getColumns() {

        return service.getColumns();
    }

    @GetMapping("/{columnId}")
    public BoardColumn getColumnById(
            @PathVariable Long columnId) {

        return service.getColumnById(columnId);
    }

    @PutMapping("/{columnId}")
    public BoardColumn updateColumn(
            @PathVariable Long columnId,
            @RequestBody BoardColumn column) {

        return service.updateColumn(columnId, column);
    }

    @DeleteMapping("/{columnId}")
    public void deleteColumn(
            @PathVariable Long columnId) {

        service.deleteColumn(columnId);
    }
}