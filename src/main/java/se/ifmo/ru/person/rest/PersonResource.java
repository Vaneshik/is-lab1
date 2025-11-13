package se.ifmo.ru.person.rest;

import se.ifmo.ru.person.model.Country;
import se.ifmo.ru.person.model.Person;
import se.ifmo.ru.person.service.PersonService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Path("/persons")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PersonResource {

    @Inject
    private PersonService personService;

    @GET
    public Response getAll(@QueryParam("page") @DefaultValue("0") int page,
                          @QueryParam("size") @DefaultValue("10") int size,
                          @QueryParam("name") String name,
                          @QueryParam("nationality") String nationality,
                          @QueryParam("sortBy") String sortBy) {
        try {
            List<Person> persons;
            
            if (name != null && !name.isEmpty()) {
                persons = personService.getPersonsByName(name);
            } else if (nationality != null && !nationality.isEmpty()) {
                persons = personService.getPersonsByNationality(Country.valueOf(nationality));
            } else {
                persons = personService.getPersonsPaginated(page, size, sortBy);
            }
            
            Map<String, Object> result = new HashMap<>();
            result.put("content", persons);
            result.put("totalElements", personService.getTotalCount());
            result.put("page", page);
            result.put("size", size);
            
            return Response.ok(result).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(Map.of("error", e.getMessage())).build();
        }
    }

    @GET
    @Path("/{id}")
    public Response getById(@PathParam("id") Integer id) {
        Person person = personService.getPersonById(id);
        if (person == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("error", "Person not found")).build();
        }
        return Response.ok(person).build();
    }

    @POST
    public Response create(Person person) {
        try {
            personService.createPerson(person);
            return Response.status(Response.Status.CREATED).entity(person).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("error", e.getMessage())).build();
        }
    }

    @PUT
    @Path("/{id}")
    public Response update(@PathParam("id") Integer id, Person person) {
        try {
            person.setId(id);
            personService.updatePerson(person);
            return Response.ok(person).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("error", e.getMessage())).build();
        }
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") Integer id) {
        try {
            personService.deletePerson(id);
            return Response.noContent().build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(Map.of("error", e.getMessage())).build();
        }
    }
}

