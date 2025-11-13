package ru.ifmo.person.model;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;

@Embeddable
public class Coordinates {

    @Max(value = 454, message = "X coordinate must be <= 454")
    private int x;

    @NotNull(message = "Y coordinate cannot be null")
    @Max(value = 698, message = "Y coordinate must be <= 698")
    private Long y;

    public Coordinates() {
    }

    public Coordinates(int x, Long y) {
        this.x = x;
        this.y = y;
    }

    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public Long getY() {
        return y;
    }

    public void setY(Long y) {
        this.y = y;
    }

    @Override
    public String toString() {
        return "(" + x + ", " + y + ")";
    }
}

