package com.syncboard.service;

import java.util.List;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.syncboard.entity.BoardColumn;
import com.syncboard.entity.Task;
import com.syncboard.repository.TaskRepository;

@Service
public class TaskService {
    private final ActivityLogService activityLogService;

    private final TaskRepository repository;

    private final SimpMessagingTemplate messagingTemplate;

    public TaskService(

        TaskRepository repository,

        ActivityLogService activityLogService,

        SimpMessagingTemplate messagingTemplate) {

    this.repository =
            repository;

    this.activityLogService =
            activityLogService;

    this.messagingTemplate =
            messagingTemplate;
}

    public Task createTask(
            Task task) {

        return repository.save(task);
    }

    public List<Task> getTasks() {

        return repository.findAll();
    }

    public Task getTaskById(Long taskId) {
        return repository.findById(taskId)
                .orElseThrow(() -> 
                    new RuntimeException(
                        "Task not found"));
    }

    public Task updateTask(Long taskId, Task taskDetails) {
        Task task = getTaskById(taskId);
        
        if (taskDetails.getTitle() != null) {
            task.setTitle(taskDetails.getTitle());
        }
        if (taskDetails.getDescription() != null) {
            task.setDescription(taskDetails.getDescription());
        }
        if (taskDetails.getPriority() != null) {
            task.setPriority(taskDetails.getPriority());
        }
        
        activityLogService.createLog(
            "Updated task " + taskId,
            "system"
        );
        
        return repository.save(task);
    }

    public void deleteTask(Long taskId) {
        repository.deleteById(taskId);
        
        activityLogService.createLog(
            "Deleted task " + taskId,
            "system"
        );
    }

    public Task moveTask(
        Long taskId,
        Long columnId) {

    Task task =
            repository.findById(taskId)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Task not found"));

    BoardColumn column =
            new BoardColumn();

    column.setId(columnId);

    task.setColumn(column);

    activityLogService.createLog(

        "Moved task "
                + taskId
                + " to column "
                + columnId,

        "system"
);

    return repository.save(task);
}
}