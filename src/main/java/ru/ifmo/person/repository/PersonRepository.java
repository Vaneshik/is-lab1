package ru.ifmo.person.repository;

import ru.ifmo.person.enumeration.Country;
import ru.ifmo.person.model.Person;
import ru.ifmo.person.enumeration.Color;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.EntityTransaction;

import java.util.List;

@ApplicationScoped
public class PersonRepository {

    @Inject
    private EntityManagerFactory emf;
    
    private EntityManager getEntityManager() {
        return emf.createEntityManager();
    }

    public List<Person> findAll() {
        EntityManager em = getEntityManager();
        try {
            return em.createQuery("SELECT p FROM Person p ORDER BY p.id", Person.class)
                    .getResultList();
        } finally {
            em.close();
        }
    }

    public List<Person> findAll(int offset, int limit, String sortBy) {
        EntityManager em = getEntityManager();
        try {
            String orderClause = "p.id";
            if (sortBy != null && !sortBy.isEmpty()) {
                switch (sortBy.toLowerCase()) {
                    case "name":
                        orderClause = "p.name";
                        break;
                    case "creationdate":
                        orderClause = "p.creationDate DESC";
                        break;
                    case "height":
                        orderClause = "p.height";
                        break;
                    case "weight":
                        orderClause = "p.weight";
                        break;
                    default:
                        orderClause = "p.id";
                }
            }
            String query = "SELECT p FROM Person p ORDER BY " + orderClause;
            return em.createQuery(query, Person.class)
                    .setFirstResult(offset)
                    .setMaxResults(limit)
                    .getResultList();
        } finally {
            em.close();
        }
    }

    public long count() {
        EntityManager em = getEntityManager();
        try {
            return em.createQuery("SELECT COUNT(p) FROM Person p", Long.class)
                    .getSingleResult();
        } finally {
            em.close();
        }
    }

    public Person findById(Long id) {
        EntityManager em = getEntityManager();
        try {
            return em.find(Person.class, id);
        } finally {
            em.close();
        }
    }

    public List<Person> findByName(String name) {
        EntityManager em = getEntityManager();
        try {
            return em.createQuery("SELECT p FROM Person p WHERE p.name = :name", Person.class)
                    .setParameter("name", name)
                    .getResultList();
        } finally {
            em.close();
        }
    }

    public List<Person> findByNationality(Country nationality) {
        EntityManager em = getEntityManager();
        try {
            return em.createQuery("SELECT p FROM Person p WHERE p.nationality = :nationality", Person.class)
                    .setParameter("nationality", nationality)
                    .getResultList();
        } finally {
            em.close();
        }
    }

    public void save(Person person) {
        EntityManager em = getEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            em.persist(person);
            tx.commit();
        } catch (Exception e) {
            if (tx.isActive()) tx.rollback();
            throw e;
        } finally {
            em.close();
        }
    }

    public Person update(Person person) {
        EntityManager em = getEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            Person updated = em.merge(person);
            tx.commit();
            return updated;
        } catch (Exception e) {
            if (tx.isActive()) tx.rollback();
            throw e;
        } finally {
            em.close();
        }
    }

    public void delete(Long id) {
        EntityManager em = getEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            Person person = em.find(Person.class, id);
            if (person != null) {
                em.remove(person);
            }
            tx.commit();
        } catch (Exception e) {
            if (tx.isActive()) tx.rollback();
            throw e;
        } finally {
            em.close();
        }
    }

    public void deleteByNationality(Country nationality) {
        EntityManager em = getEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            em.createQuery("DELETE FROM Person p WHERE p.nationality = :nationality")
                    .setParameter("nationality", nationality)
                    .executeUpdate();
            tx.commit();
        } catch (Exception e) {
            if (tx.isActive()) tx.rollback();
            throw e;
        } finally {
            em.close();
        }
    }

    public Double getAverageHeight() {
        EntityManager em = getEntityManager();
        try {
            Object result = em.createQuery("SELECT AVG(p.height) FROM Person p WHERE p.height IS NOT NULL")
                    .getSingleResult();
            if (result == null) {
                return 0.0;
            }
            if (result instanceof Double) {
                return (Double) result;
            }
            return ((Number) result).doubleValue();
        } catch (Exception e) {
            e.printStackTrace();
            return 0.0;
        } finally {
            em.close();
        }
    }

    public List<Country> getUniqueNationalities() {
        EntityManager em = getEntityManager();
        try {
            return em.createQuery("SELECT DISTINCT p.nationality FROM Person p WHERE p.nationality IS NOT NULL ORDER BY p.nationality", Country.class)
                    .getResultList();
        } catch (Exception e) {
            e.printStackTrace();
            return List.of();
        } finally {
            em.close();
        }
    }

    public Double getHairColorPercentage(Color hairColor) {
        EntityManager em = getEntityManager();
        try {
            Long total = em.createQuery("SELECT COUNT(p) FROM Person p", Long.class)
                    .getSingleResult();
            
            if (total == 0) {
                return 0.0;
            }
            
            Long colorCount = em.createQuery("SELECT COUNT(p) FROM Person p WHERE p.hairColor = :color", Long.class)
                    .setParameter("color", hairColor)
                    .getSingleResult();
            
            return (colorCount.doubleValue() / total.doubleValue()) * 100.0;
        } catch (Exception e) {
            e.printStackTrace();
            return 0.0;
        } finally {
            em.close();
        }
    }

    public Long countByHairColorAndLocation(Color hairColor, Integer locationId) {
        EntityManager em = getEntityManager();
        try {
            if (locationId == null) {
                return em.createQuery("SELECT COUNT(p) FROM Person p WHERE p.hairColor = :color AND p.location IS NULL", Long.class)
                        .setParameter("color", hairColor)
                        .getSingleResult();
            } else {
                return em.createQuery("SELECT COUNT(p) FROM Person p WHERE p.hairColor = :color AND p.location.id = :locationId", Long.class)
                        .setParameter("color", hairColor)
                        .setParameter("locationId", locationId)
                        .getSingleResult();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return 0L;
        } finally {
            em.close();
        }
    }
}

