package com.robmelfi.health.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

/**
 * A Weigth.
 */
@Entity
@Table(name = "weigth")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "weigth")
public class Weigth implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "jhi_timestamp", nullable = false)
    private ZonedDateTime timestamp;

    @NotNull
    @Column(name = "weight", nullable = false)
    private Double weight;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("")
    private User user;

    public Weigth() {}

    public Weigth(ZonedDateTime timestamp, Double weight, User user) {
        this.timestamp = timestamp;
        this.weight = weight;
        this.user = user;
    }

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getTimestamp() {
        return timestamp;
    }

    public Weigth timestamp(ZonedDateTime timestamp) {
        this.timestamp = timestamp;
        return this;
    }

    public void setTimestamp(ZonedDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public Double getWeight() {
        return weight;
    }

    public Weigth weight(Double weight) {
        this.weight = weight;
        return this;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public User getUser() {
        return user;
    }

    public Weigth user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Weigth weigth = (Weigth) o;
        if (weigth.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), weigth.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Weigth{" +
            "id=" + getId() +
            ", timestamp='" + getTimestamp() + "'" +
            ", weight=" + getWeight() +
            "}";
    }
}
