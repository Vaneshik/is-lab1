package se.ifmo.ru.person.service;

import se.ifmo.ru.person.model.Color;
import se.ifmo.ru.person.model.Country;
import se.ifmo.ru.person.model.Person;
import se.ifmo.ru.person.repository.PersonRepository;
import se.ifmo.ru.person.websocket.PersonWebSocket;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.List;

@ApplicationScoped
public class PersonService {

    @Inject
    private PersonRepository personRepository;

    public List<Person> getAllPersons() {
        return personRepository.findAll();
    }

    public List<Person> getPersonsPaginated(int page, int pageSize, String sortBy) {
        int offset = page * pageSize;
        return personRepository.findAll(offset, pageSize, sortBy);
    }

    public long getTotalCount() {
        return personRepository.count();
    }

    public Person getPersonById(Integer id) {
        return personRepository.findById(id);
    }

    public List<Person> getPersonsByName(String name) {
        return personRepository.findByName(name);
    }

    public List<Person> getPersonsByNationality(Country nationality) {
        return personRepository.findByNationality(nationality);
    }

    public void createPerson(Person person) {
        personRepository.save(person);
        // Уведомить всех клиентов о создании
        PersonWebSocket.notifyClients("created", person.getId());
    }

    public void updatePerson(Person person) {
        personRepository.update(person);
        // Уведомить всех клиентов об обновлении
        PersonWebSocket.notifyClients("updated", person.getId());
    }

    public void deletePerson(Integer id) {
        personRepository.delete(id);
        // Уведомить всех клиентов об удалении
        PersonWebSocket.notifyClients("deleted", id);
    }

    // Special operations
    public void deleteByNationality(Country nationality) {
        personRepository.deleteByNationality(nationality);
        // Уведомить всех клиентов о массовом удалении
        PersonWebSocket.notifyClients("bulk_deleted", null);
    }

    public Double getAverageHeight() {
        Double avg = personRepository.getAverageHeight();
        return avg != null ? avg : 0.0;
    }

    public List<Country> getUniqueNationalities() {
        return personRepository.getUniqueNationalities();
    }

    public Double getHairColorPercentage(Color hairColor) {
        return personRepository.getHairColorPercentage(hairColor);
    }

    public Long countByHairColorAndLocation(Color hairColor, Integer locationId) {
        return personRepository.countByHairColorAndLocation(hairColor, locationId);
    }
}

