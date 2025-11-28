package ru.ifmo.person.dto;

public class CoordinatesDto {
    private Integer x;
    private Long y;

    public CoordinatesDto() {
    }

    public CoordinatesDto(Integer x, Long y) {
        this.x = x;
        this.y = y;
    }

    public Integer getX() {
        return x;
    }

    public void setX(Integer x) {
        this.x = x;
    }

    public Long getY() {
        return y;
    }

    public void setY(Long y) {
        this.y = y;
    }
}

