package com.robmelfi.health.service.dto;

import java.time.LocalDate;

public class PointsPerWeekDTO {
    private LocalDate week;
    private Integer points;

    public PointsPerWeekDTO(LocalDate week, Integer points) {
        this.week = week;
        this.points = points;
    }

    public LocalDate getWeek() {
        return week;
    }

    public void setWeek(LocalDate week) {
        this.week = week;
    }

    public Integer getPoints() {
        return points;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }

    @Override
    public String toString() {
        return "PointsThisWeek{" +
            "points=" + points +
            ", week=" + week +
            "}";
    }
}
