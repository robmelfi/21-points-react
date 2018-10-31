package com.robmelfi.health.service.dto;

import com.robmelfi.health.domain.Points;

import java.time.YearMonth;
import java.util.List;

public class PointsPerMonthDTO {
    private YearMonth month;
    private List<Points> points;

    public PointsPerMonthDTO(YearMonth yearWithMonth, List<Points> points) {
        this.month = yearWithMonth;
        this.points = points;
    }

    public YearMonth getMonth() {
        return month;
    }

    public void setMonth(YearMonth month) {
        this.month = month;
    }

    public List<Points> getPoints() {
        return points;
    }

    public void setPoints(List<Points> points) {
        this.points = points;
    }

    @Override
    public String toString() {
        return "PointsPerMonth{" +
            "month=" + month +
            ", points=" + points +
            '}';
    }
}
