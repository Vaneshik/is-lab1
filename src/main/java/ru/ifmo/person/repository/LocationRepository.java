package ru.ifmo.person.repository;

import ru.ifmo.person.model.Location;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.EntityTransaction;

import java.util.List;

@ApplicationScoped
public class LocationRepository {

    @Inject
    private EntityManagerFactory emf;
    
    private EntityManager getEntityManager() {
        return emf.createEntityManager();
    }

    public List<Location> findAll() {
        EntityManager em = getEntityManager();
        try {
            return em.createQuery("SELECT l FROM Location l ORDER BY l.id", Location.class)
                    .getResultList();
        } finally {
            em.close();
        }
    }

    public Location findById(Integer id) {
        EntityManager em = getEntityManager();
        try {
            return em.find(Location.class, id);
        } finally {
            em.close();
        }
    }

    public void save(Location location) {
        EntityManager em = getEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            em.persist(location);
            tx.commit();
        } catch (Exception e) {
            if (tx.isActive()) tx.rollback();
            throw e;
        } finally {
            em.close();
        }
    }

    public Location update(Location location) {
        EntityManager em = getEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            Location updated = em.merge(location);
            tx.commit();
            return updated;
        } catch (Exception e) {
            if (tx.isActive()) tx.rollback();
            throw e;
        } finally {
            em.close();
        }
    }

    public void delete(Integer id) {
        EntityManager em = getEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            Location location = em.find(Location.class, id);
            if (location != null) {
                em.remove(location);
            }
            tx.commit();
        } catch (Exception e) {
            if (tx.isActive()) tx.rollback();
            throw e;
        } finally {
            em.close();
        }
    }
}

