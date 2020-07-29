package it.polste.attsw.teammatesmanagerbackend.controllers;

import io.restassured.module.mockmvc.RestAssuredMockMvc;
import it.polste.attsw.teammatesmanagerbackend.exceptions.TeammateAlreadyExistsException;
import it.polste.attsw.teammatesmanagerbackend.exceptions.TeammateNotExistsException;
import it.polste.attsw.teammatesmanagerbackend.exceptions.TeammateRestControllerExceptionHandler;
import it.polste.attsw.teammatesmanagerbackend.models.PersonalData;
import it.polste.attsw.teammatesmanagerbackend.models.Skill;
import it.polste.attsw.teammatesmanagerbackend.models.Teammate;
import it.polste.attsw.teammatesmanagerbackend.services.TeammateService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import static io.restassured.module.mockmvc.RestAssuredMockMvc.given;
import static io.restassured.module.mockmvc.RestAssuredMockMvc.when;
import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.Matchers.empty;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class TeammateRestControllerTest {

  @Mock
  private TeammateService teammateService;

  @InjectMocks
  private TeammateRestController teammateRestController;

  @InjectMocks
  private TeammateRestControllerExceptionHandler teammateRestControllerExceptionHandler;

  private PersonalData stefanosData;
  private PersonalData paolosData;
  private Set<Skill> skills;

  private String teammateAlreadyExistsMessage;
  private String teammateNotExistsMessage;

  @Before
  public void setup() {
    RestAssuredMockMvc.standaloneSetup(teammateRestController,
            teammateRestControllerExceptionHandler);

    stefanosData = new PersonalData("Stefano Vannucchi",
            "stefano.vannucchi@stud.unifi.it",
            "M",
            "Prato",
            "student",
            "https://semantic-ui.com/images/avatar/large/steve.jpg");

    paolosData = new PersonalData("Paolo Innocenti",
            "paolo.innocenti@stud.unifi.it",
            "M",
            "Pistoia",
            "student",
            "https://semantic-ui.com/images/avatar/large/elliot.jpg");

    skills = new HashSet<>();
    skills.add(new Skill(1L, "Spring Boot"));
    skills.add(new Skill(2L, "Vue js"));

    teammateAlreadyExistsMessage =
            "The entered email has already been associated with a Teammate";
    teammateNotExistsMessage = "No Teammate with id 1 exists!";
  }

  @Test
  public void testGetAllTeammatesWhenEmpty() {
    when().
            get("/api/teammates").
    then().
            statusCode(HttpStatus.OK.value()).
            assertThat().
            body("", empty());
  }

  @Test
  public void testGetAllTeammatesWhenNotEmpty() {
    when(teammateService.getAllTeammates())
            .thenReturn(Arrays.asList(
                    new Teammate(1L, stefanosData, skills),
                    new Teammate(2L, paolosData, skills)
            ));

    when().
            get("/api/teammates").
    then().
            statusCode(HttpStatus.OK.value()).
            assertThat().
            body(
                    "id", hasItems(1, 2),
                    "personalData.name", hasItems("Stefano Vannucchi", "Paolo Innocenti"),
                    "personalData.email", hasItems(
                            "stefano.vannucchi@stud.unifi.it",
                            "paolo.innocenti@stud.unifi.it"
                    ),
                    "personalData.gender", hasItem("M"),
                    "personalData.city", hasItems("Prato", "Pistoia"),
                    "personalData.role", hasItem("student"),
                    "personalData.photoUrl", hasItems(
                            "https://semantic-ui.com/images/avatar/large/steve.jpg",
                            "https://semantic-ui.com/images/avatar/large/elliot.jpg"
                    ),
                    "skills.id", everyItem(hasItems(1, 2)),
                    "skills.name", everyItem(hasItems("Spring Boot", "Vue js"))
            );
  }

  @Test
  public void testInsertNewTeammateWithSuccess() {
    Teammate teammateToInsert = new Teammate(null, stefanosData, skills);

    when(teammateService.insertNewTeammate(any(Teammate.class)))
            .thenReturn(new Teammate(1L, stefanosData, skills));

    given().
            contentType(MediaType.APPLICATION_JSON_VALUE).
            body(teammateToInsert).
    when().
            post("/api/teammates/new").
    then().
            statusCode(HttpStatus.OK.value()).
            assertThat().
            body(
                    "id", equalTo(1),
                    "personalData.name", equalTo("Stefano Vannucchi"),
                    "personalData.email", equalTo("stefano.vannucchi@stud.unifi.it"),
                    "personalData.gender", equalTo("M"),
                    "personalData.city", equalTo("Prato"),
                    "personalData.role", equalTo("student"),
                    "personalData.photoUrl", equalTo(
                            "https://semantic-ui.com/images/avatar/large/steve.jpg"),
                    "skills.id", hasItems(1, 2),
                    "skills.name", hasItems("Spring Boot", "Vue js")
            );
  }

  @Test
  public void testInsertNewTeammateWhenDuplicateEmail() {
    Teammate teammateToInsert = new Teammate(null, stefanosData, skills);

    when(teammateService.insertNewTeammate(any(Teammate.class)))
            .thenThrow(new TeammateAlreadyExistsException(teammateAlreadyExistsMessage));

    given().
            contentType(MediaType.APPLICATION_JSON_VALUE).
            body(teammateToInsert).
    when().
            post("/api/teammates/new").
    then().
            statusCode(HttpStatus.FORBIDDEN.value()).
            assertThat().
            body("message", equalTo(teammateAlreadyExistsMessage));
  }

  @Test
  public void testUpdateTeammateWithSuccess() {
    Teammate teammateToUpdate = new Teammate(null, stefanosData, skills);

    when(teammateService.updateTeammate(anyLong(), any(Teammate.class)))
            .thenReturn(new Teammate(1L, stefanosData, skills));

    given().
            contentType(MediaType.APPLICATION_JSON_VALUE).
            body(teammateToUpdate).
    when().
            put("/api/teammates/update/1").
    then().
            statusCode(HttpStatus.OK.value()).
            assertThat().
            body(
                    "id", equalTo(1),
                    "personalData.name", equalTo("Stefano Vannucchi"),
                    "personalData.email", equalTo("stefano.vannucchi@stud.unifi.it"),
                    "personalData.gender", equalTo("M"),
                    "personalData.city", equalTo("Prato"),
                    "personalData.role", equalTo("student"),
                    "personalData.photoUrl", equalTo(
                            "https://semantic-ui.com/images/avatar/large/steve.jpg"),
                    "skills.id", hasItems(1, 2),
                    "skills.name", hasItems("Spring Boot", "Vue js")
            );
  }

  @Test
  public void testUpdateTeammateWhenNoExisting() {
    Teammate teammateToUpdate = new Teammate(null, stefanosData, skills);

    when(teammateService.updateTeammate(anyLong(), any(Teammate.class)))
            .thenThrow(new TeammateNotExistsException(teammateNotExistsMessage));

    given().
            contentType(MediaType.APPLICATION_JSON_VALUE).
            body(teammateToUpdate).
    when().
            put("/api/teammates/update/1").
    then().
            statusCode(HttpStatus.NOT_FOUND.value()).
            assertThat().
            body("message", equalTo(teammateNotExistsMessage));
  }

  @Test
  public void testUpdateTeammateWhenDuplicateEmail() {
    Teammate teammateToUpdate = new Teammate(null, stefanosData, skills);

    when(teammateService.updateTeammate(anyLong(), any(Teammate.class)))
            .thenThrow(new TeammateAlreadyExistsException(teammateAlreadyExistsMessage));

    given().
            contentType(MediaType.APPLICATION_JSON_VALUE).
            body(teammateToUpdate).
    when().
            put("/api/teammates/update/1").
    then().
            statusCode(HttpStatus.FORBIDDEN.value()).
            assertThat().
            body("message", equalTo(teammateAlreadyExistsMessage));
  }

  @Test
  public void testDeleteTeammateWithSuccess() {
    when().
            delete("api/teammates/delete/1").
    then().
            statusCode(HttpStatus.OK.value());

    verify(teammateService, times(1)).deleteTeammate(1L);
  }

  @Test
  public void testDeleteTeammateWhenNotExists() {
    doThrow(new TeammateNotExistsException(teammateNotExistsMessage))
            .when(teammateService).deleteTeammate(1L);

    when().
            delete("api/teammates/delete/1").
    then().
            statusCode(HttpStatus.NOT_FOUND.value()).
            assertThat().
            body("message", equalTo(teammateNotExistsMessage));
  }

}
