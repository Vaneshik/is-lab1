package se.ifmo.ru.person.rest;

import se.ifmo.ru.person.model.Color;
import se.ifmo.ru.person.model.Country;
import se.ifmo.ru.person.service.PersonService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.Map;

@Path("/operations")
@Produces(MediaType.APPLICATION_JSON)
public class OperationsResource {

    @Inject
    private PersonService personService;

    @DELETE
    @Path("/delete-by-nationality")
    public Response deleteByNationality(@QueryParam("nationality") String nationality) {
        try {
            personService.deleteByNationality(Country.valueOf(nationality));
            return Response.ok(Map.of("message", "Deleted successfully")).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("error", e.getMessage())).build();
        }
    }

    @GET
    @Path("/average-height")
    public Response getAverageHeight() {
        Double avg = personService.getAverageHeight();
        return Response.ok(Map.of("averageHeight", avg)).build();
    }

    @GET
    @Path("/unique-nationalities")
    public Response getUniqueNationalities() {
        return Response.ok(personService.getUniqueNationalities()).build();
    }

    @GET
    @Path("/hair-color-percentage")
    public Response getHairColorPercentage(@QueryParam("color") String color) {
        try {
            Double percentage = personService.getHairColorPercentage(Color.valueOf(color));
            return Response.ok(Map.of("percentage", percentage)).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("error", e.getMessage())).build();
        }
    }

    @GET
    @Path("/count-by-location")
    public Response countByHairColorAndLocation(@QueryParam("color") String color,
                                               @QueryParam("locationId") Integer locationId) {
        try {
            Long count = personService.countByHairColorAndLocation(Color.valueOf(color), locationId);
            return Response.ok(Map.of("count", count)).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("error", e.getMessage())).build();
        }
    }
}

