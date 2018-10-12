package com.robmelfi.health.service.dto;

import java.time.LocalDate;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the Points entity.
 */
public class PointsDTO implements Serializable {

    private Long id;

    @NotNull
    private LocalDate date;

    private Integer excercise;

    private Integer meals;

    private Integer alcohol;

    @Size(max = 140)
    private String notes;

    private Long userId;

    private String userLogin;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Integer getExcercise() {
        return excercise;
    }

    public void setExcercise(Integer excercise) {
        this.excercise = excercise;
    }

    public Integer getMeals() {
        return meals;
    }

    public void setMeals(Integer meals) {
        this.meals = meals;
    }

    public Integer getAlcohol() {
        return alcohol;
    }

    public void setAlcohol(Integer alcohol) {
        this.alcohol = alcohol;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserLogin() {
        return userLogin;
    }

    public void setUserLogin(String userLogin) {
        this.userLogin = userLogin;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        PointsDTO pointsDTO = (PointsDTO) o;
        if (pointsDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), pointsDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "PointsDTO{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", excercise=" + getExcercise() +
            ", meals=" + getMeals() +
            ", alcohol=" + getAlcohol() +
            ", notes='" + getNotes() + "'" +
            ", user=" + getUserId() +
            ", user='" + getUserLogin() + "'" +
            "}";
    }
}
