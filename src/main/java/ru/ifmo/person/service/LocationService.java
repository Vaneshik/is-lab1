package ru.ifmo.person.service;

import ru.ifmo.person.model.Location;
import ru.ifmo.person.repository.LocationRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.List;

@ApplicationScoped
public class LocationService {

    @Inject
    private LocationRepository locationRepository;

    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }

    public Location getLocationById(Integer id) {
        return locationRepository.findById(id);
    }

    public void createLocation(Location location) {
        locationRepository.save(location);
    }

    public void updateLocation(Location location) {
        locationRepository.update(location);
    }

    public void deleteLocation(Integer id) {
        locationRepository.delete(id);
    }
}

