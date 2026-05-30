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

import com.syncboard.entity.Task;
import com.syncboard.service.TaskService;

@RestController
@RequestMapping("/api/v1/tasks")
public class TaskController {

    private final TaskService service;

    public TaskController(
            TaskService service) {

        this.service = service;
    }

    @PostMapping
    public Task createTask(
            @RequestBody Task task) {

        return service.createTask(
                task);
    }

    @GetMapping
    public List<Task> getTasks() {

        return service.getTasks();
    }

    @GetMapping("/{taskId}")
    public Task getTaskById(
            @PathVariable Long taskId) {

        return service.getTaskById(taskId);
    }

    @PutMapping("/{taskId}")
    public Task updateTask(
            @PathVariable Long taskId,
            @RequestBody Task task) {

        return service.updateTask(taskId, task);
    }

    @DeleteMapping("/{taskId}")
    public void deleteTask(
            @PathVariable Long taskId) {

        service.deleteTask(taskId);
    }

    @PutMapping("/{taskId}/move/{columnId}")
    public Task moveTask(
            @PathVariable Long taskId,
            @PathVariable Long columnId) {

        return service.moveTask(
                taskId,
                columnId);
    }
}