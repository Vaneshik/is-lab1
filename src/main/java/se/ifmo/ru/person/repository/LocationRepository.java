package se.ifmo.ru.person.repository;

import se.ifmo.ru.person.model.Location;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;

import java.util.List;

@ApplicationScoped
public class LocationRepository {

    @Inject
    private EntityManagerFactory emf;

    public List<Location> findAll() {
        EntityManager em = emf.createEntityManager();
        try {
            return em.createQuery("SELECT l FROM Location l ORDER BY l.id", Location.class)
                    .getResultList();
        } finally {
            em.close();
        }
    }

    public Location findById(Integer id) {
        EntityManager em = emf.createEntityManager();
        try {
            return em.find(Location.class, id);
        } finally {
            em.close();
        }
    }

    public void save(Location location) {
        EntityManager em = emf.createEntityManager();
        try {
            em.getTransaction().begin();
            em.persist(location);
            em.getTransaction().commit();
        } catch (Exception e) {
            if (em.getTransaction().isActive()) {
                em.getTransaction().rollback();
            }
            throw e;
        } finally {
            em.close();
        }
    }

    public Location update(Location location) {
        EntityManager em = emf.createEntityManager();
        try {
            em.getTransaction().begin();
            Location merged = em.merge(location);
            em.getTransaction().commit();
            return merged;
        } catch (Exception e) {
            if (em.getTransaction().isActive()) {
                em.getTransaction().rollback();
            }
            throw e;
        } finally {
            em.close();
        }
    }

    public void delete(Integer id) {
        EntityManager em = emf.createEntityManager();
        try {
            em.getTransaction().begin();
            Location location = em.find(Location.class, id);
            if (location != null) {
                em.remove(location);
            }
            em.getTransaction().commit();
        } catch (Exception e) {
            if (em.getTransaction().isActive()) {
                em.getTransaction().rollback();
            }
            throw e;
        } finally {
            em.close();
        }
    }
}

