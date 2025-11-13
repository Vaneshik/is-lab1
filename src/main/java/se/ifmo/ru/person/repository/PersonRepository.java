package se.ifmo.ru.person.repository;

import se.ifmo.ru.person.model.Country;
import se.ifmo.ru.person.model.Person;
import se.ifmo.ru.person.model.Color;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;

import java.math.BigDecimal;
import java.util.List;

@ApplicationScoped
public class PersonRepository {

    @Inject
    private EntityManagerFactory emf;

    public List<Person> findAll() {
        EntityManager em = emf.createEntityManager();
        try {
            return em.createQuery("SELECT p FROM Person p ORDER BY p.id", Person.class)
                    .getResultList();
        } finally {
            em.close();
        }
    }

    public List<Person> findAll(int offset, int limit, String sortBy) {
        EntityManager em = emf.createEntityManager();
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
        EntityManager em = emf.createEntityManager();
        try {
            return em.createQuery("SELECT COUNT(p) FROM Person p", Long.class)
                    .getSingleResult();
        } finally {
            em.close();
        }
    }

    public Person findById(Integer id) {
        EntityManager em = emf.createEntityManager();
        try {
            return em.find(Person.class, id);
        } finally {
            em.close();
        }
    }

    public List<Person> findByName(String name) {
        EntityManager em = emf.createEntityManager();
        try {
            return em.createQuery("SELECT p FROM Person p WHERE p.name = :name", Person.class)
                    .setParameter("name", name)
                    .getResultList();
        } finally {
            em.close();
        }
    }

    public List<Person> findByNationality(Country nationality) {
        EntityManager em = emf.createEntityManager();
        try {
            return em.createQuery("SELECT p FROM Person p WHERE p.nationality = :nationality", Person.class)
                    .setParameter("nationality", nationality)
                    .getResultList();
        } finally {
            em.close();
        }
    }

    public void save(Person person) {
        EntityManager em = emf.createEntityManager();
        try {
            em.getTransaction().begin();
            em.persist(person);
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

    public Person update(Person person) {
        EntityManager em = emf.createEntityManager();
        try {
            em.getTransaction().begin();
            Person merged = em.merge(person);
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
            Person person = em.find(Person.class, id);
            if (person != null) {
                em.remove(person);
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

    public void deleteByNationality(Country nationality) {
        EntityManager em = emf.createEntityManager();
        try {
            em.getTransaction().begin();
            // Вызов функции PostgreSQL
            em.createNativeQuery("SELECT delete_persons_by_nationality(:nationality)")
                    .setParameter("nationality", nationality.name())
                    .getSingleResult();
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

    public Double getAverageHeight() {
        EntityManager em = emf.createEntityManager();
        try {
            // Вызов функции PostgreSQL
            Object result = em.createNativeQuery("SELECT get_average_height()")
                    .getSingleResult();
            if (result instanceof BigDecimal) {
                return ((BigDecimal) result).doubleValue();
            }
            return result != null ? ((Number) result).doubleValue() : 0.0;
        } finally {
            em.close();
        }
    }

    public List<Country> getUniqueNationalities() {
        EntityManager em = emf.createEntityManager();
        try {
            // Вызов функции PostgreSQL
            List<String> nationalityStrings = em.createNativeQuery("SELECT * FROM get_unique_nationalities()")
                    .getResultList();
            return nationalityStrings.stream()
                    .map(Country::valueOf)
                    .toList();
        } finally {
            em.close();
        }
    }

    public Double getHairColorPercentage(Color hairColor) {
        EntityManager em = emf.createEntityManager();
        try {
            // Вызов функции PostgreSQL
            Object result = em.createNativeQuery("SELECT get_hair_color_percentage(:color)")
                    .setParameter("color", hairColor.name())
                    .getSingleResult();
            if (result instanceof BigDecimal) {
                return ((BigDecimal) result).doubleValue();
            }
            return result != null ? ((Number) result).doubleValue() : 0.0;
        } finally {
            em.close();
        }
    }

    public Long countByHairColorAndLocation(Color hairColor, Integer locationId) {
        EntityManager em = emf.createEntityManager();
        try {
            // Вызов функции PostgreSQL
            Object result = em.createNativeQuery("SELECT count_by_hair_color_and_location(:color, :locationId)")
                    .setParameter("color", hairColor.name())
                        .setParameter("locationId", locationId)
                        .getSingleResult();
            return result != null ? ((Number) result).longValue() : 0L;
        } finally {
            em.close();
        }
    }
}

