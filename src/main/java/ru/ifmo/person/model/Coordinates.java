package ru.ifmo.person.model;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;

@Embeddable
public class Coordinates {

    @Max(value = 454, message = "X coordinate must be <= 454")
    private double x;

    @Max(value = 698, message = "Y coordinate must be <= 698")
    private int y;

    public Coordinates() {
    }

    public Coordinates(double x, int y) {
        this.x = x;
        this.y = y;
    }

    public double getX() {
        return x;
    }

    public void setX(double x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }

    @Override
    public String toString() {
        return "(" + x + ", " + y + ")";
    }
}

