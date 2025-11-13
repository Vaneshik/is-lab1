package ru.ifmo.person.repository;

import ru.ifmo.person.model.Location;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

import java.util.List;

@ApplicationScoped
public class LocationRepository {

    @PersistenceContext
    private EntityManager em;

    public List<Location> findAll() {
        return em.createQuery("SELECT l FROM Location l ORDER BY l.id", Location.class)
                .getResultList();
    }

    public Location findById(Integer id) {
        return em.find(Location.class, id);
    }

    @Transactional
    public void save(Location location) {
        em.persist(location);
    }

    @Transactional
    public Location update(Location location) {
        return em.merge(location);
    }

    @Transactional
    public void delete(Integer id) {
        Location location = em.find(Location.class, id);
        if (location != null) {
            em.remove(location);
        }
    }
}

