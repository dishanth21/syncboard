package com.syncboard.dto;

public class TaskMoveEvent {

    private Long taskId;

    private Long columnId;

    public TaskMoveEvent() {}

    public TaskMoveEvent(
            Long taskId,
            Long columnId) {

        this.taskId = taskId;

        this.columnId = columnId;
    }

    public Long getTaskId() {
        return taskId;
    }

    public Long getColumnId() {
        return columnId;
    }
}