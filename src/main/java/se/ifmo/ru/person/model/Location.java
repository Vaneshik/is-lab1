package se.ifmo.ru.person.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "locations")
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull(message = "Location X coordinate cannot be null")
    @Column(nullable = false)
    private Long x;

    @Column(nullable = false)
    private long y;

    @NotNull(message = "Location Z coordinate cannot be null")
    @Column(nullable = false)
    private Long z;

    @Size(max = 953, message = "Location name must be <= 953 characters")
    private String name;

    public Location() {
    }

    public Location(Long x, long y, Long z, String name) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.name = name;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Long getX() {
        return x;
    }

    public void setX(Long x) {
        this.x = x;
    }

    public long getY() {
        return y;
    }

    public void setY(long y) {
        this.y = y;
    }

    public Long getZ() {
        return z;
    }

    public void setZ(Long z) {
        this.z = z;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return (name != null ? name + " " : "") + "(" + x + ", " + y + ", " + z + ")";
    }
}

