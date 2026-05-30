package com.syncboard.dto;

public class AnalyticsResponse {

    private long totalTasks;

    private long completedTasks;

    private double completionRate;

    public AnalyticsResponse(
            long totalTasks,

            long completedTasks,

            double completionRate) {

        this.totalTasks =
                totalTasks;

        this.completedTasks =
                completedTasks;

        this.completionRate =
                completionRate;
    }

    public long getTotalTasks() {
        return totalTasks;
    }

    public long getCompletedTasks() {
        return completedTasks;
    }

    public double getCompletionRate() {
        return completionRate;
    }
}