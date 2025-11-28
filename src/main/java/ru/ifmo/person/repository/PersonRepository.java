package ru.ifmo.person.repository;

import ru.ifmo.person.enumeration.Country;
import ru.ifmo.person.model.Person;
import ru.ifmo.person.enumeration.Color;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

import java.util.List;

@ApplicationScoped
public class PersonRepository {

    @PersistenceContext
    private EntityManager em;

    public List<Person> findAll() {
        return em.createQuery("SELECT p FROM Person p ORDER BY p.id", Person.class)
                .getResultList();
    }

    public List<Person> findAll(int offset, int limit, String sortBy) {
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
    }

    public long count() {
        return em.createQuery("SELECT COUNT(p) FROM Person p", Long.class)
                .getSingleResult();
    }

    public Person findById(Integer id) {
        return em.find(Person.class, id);
    }

    public List<Person> findByName(String name) {
        return em.createQuery("SELECT p FROM Person p WHERE p.name = :name", Person.class)
                .setParameter("name", name)
                .getResultList();
    }

    public List<Person> findByNationality(Country nationality) {
        return em.createQuery("SELECT p FROM Person p WHERE p.nationality = :nationality", Person.class)
                .setParameter("nationality", nationality)
                .getResultList();
    }

    @Transactional
    public void save(Person person) {
        em.persist(person);
    }

    @Transactional
    public Person update(Person person) {
        return em.merge(person);
    }

    @Transactional
    public void delete(Integer id) {
        Person person = em.find(Person.class, id);
        if (person != null) {
            em.remove(person);
        }
    }

    @Transactional
    public void deleteByNationality(Country nationality) {
        em.createQuery("DELETE FROM Person p WHERE p.nationality = :nationality")
                .setParameter("nationality", nationality)
                .executeUpdate();
    }

    public Double getAverageHeight() {
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
        }
    }

    public List<Country> getUniqueNationalities() {
        try {
            return em.createQuery("SELECT DISTINCT p.nationality FROM Person p WHERE p.nationality IS NOT NULL ORDER BY p.nationality", Country.class)
                    .getResultList();
        } catch (Exception e) {
            e.printStackTrace();
            return List.of();
        }
    }

    public Double getHairColorPercentage(Color hairColor) {
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
        }
    }

    public Long countByHairColorAndLocation(Color hairColor, Integer locationId) {
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
        }
    }
}

