package com.robmelfi.health.service.dto;

import com.robmelfi.health.domain.Weigth;

import java.util.List;

public class WeigthByPeriodDTO {
    private String period;
    private List<Weigth> weighIns;

    public WeigthByPeriodDTO(String period, List<Weigth> weighIns) {
        this.period = period;
        this.weighIns = weighIns;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public List<Weigth> getWeighIns() {
        return weighIns;
    }

    public void setWeighIns(List<Weigth> weighIns) {
        this.weighIns = weighIns;
    }

    @Override
    public String toString() {
        return "WeightByPeriod{" +
            "period='" + period + '\'' +
            ", weighIns=" + weighIns +
            '}';
    }
}
