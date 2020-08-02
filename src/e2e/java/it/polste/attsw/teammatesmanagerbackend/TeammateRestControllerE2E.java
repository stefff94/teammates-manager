package it.polste.attsw.teammatesmanagerbackend;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import static io.restassured.RestAssured.*;
import static org.hamcrest.CoreMatchers.hasItems;
import static org.hamcrest.Matchers.*;

import io.restassured.RestAssured;
import it.polste.attsw.teammatesmanagerbackend.models.PersonalData;
import it.polste.attsw.teammatesmanagerbackend.models.Skill;
import it.polste.attsw.teammatesmanagerbackend.models.Teammate;

import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.HashSet;
import java.util.Set;

public class TeammateRestControllerE2E {

  private static final Logger LOGGER =
          LoggerFactory.getLogger(TeammateRestControllerE2E.class);

  private final static int port =
          Integer.parseInt(System.getProperty("server.port", "8080"));;

  private final static String baseUrl = "http://localhost:" + port + "/api";

  @Before
  public void setup() {
    RestAssured.baseURI = baseUrl;
    RestAssured.port = port;
  }

  @Test
  public void testCreateNewTeammateE2E() {
    Set<Skill> skills = new HashSet<>();
    Skill newSkill = new Skill(null, "Java");
    skills.add(newSkill);

    PersonalData teammateData = new PersonalData(
            "Paolo Innocenti",
            "paolo.innocenti@stud.unifi.it",
            "M",
            "Pistoia",
            "Student",
            "PhotoUrl");

    Teammate teammate = new Teammate(null, teammateData, skills);

    given().
            contentType(MediaType.APPLICATION_JSON_VALUE).
            body(teammate).
    when().
            request("POST", "/teammates/new").
    then().
            statusCode(200).
            body(
                    "personalData.name", equalTo("Paolo Innocenti"),
                    "personalData.email", equalTo("paolo.innocenti@stud.unifi.it"),
                    "personalData.gender", equalTo("M"),
                    "personalData.city", equalTo("Pistoia"),
                    "personalData.role", equalTo("Student"),
                    "personalData.photoUrl", equalTo("PhotoUrl"),
                    "skills.name", hasItems("Java")
            );
  }

  @Test
  public void testUpdateTeammateE2E()
          throws JsonProcessingException, JSONException {

    Set<Skill> skills = new HashSet<>();
    Skill newSkill = new Skill(null, "Java");
    skills.add(newSkill);

    PersonalData teammateData = new PersonalData(
            "Paolo Innocenti",
            "paolo.innocenti@stud.unifi.it",
            "M",
            "Pistoia",
            "Student",
            "PhotoUrl");

    Teammate teammate = new Teammate(null, teammateData, skills);

    int teammateId = Integer.parseInt(postTeammate(teammate));
    teammateData.setEmail("innocentipaolo1@gmail.com");
    teammateData.setName("Paolo");

    given().
            contentType(MediaType.APPLICATION_JSON_VALUE).
            body(teammate).
    when().
            request("PUT", "/teammates/update/" + teammateId).
    then().
            statusCode(200).
            body("id", equalTo(teammateId),
                    "personalData.name", equalTo("Paolo"),
                    "personalData.email", equalTo("innocentipaolo1@gmail.com")
            );
  }

  private String postTeammate(Teammate teammate)
          throws JsonProcessingException, JSONException {

    ObjectMapper mapper = new ObjectMapper();
    String body = mapper.writeValueAsString(teammate);

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    HttpEntity<String> entity =
            new HttpEntity<>(body, headers);

    ResponseEntity<String> answer = new RestTemplate()
            .postForEntity(baseUrl + "/teammates/new",
                    entity, String.class);
    LOGGER.debug("answer for newTeammate: " + answer);

    return new JSONObject(answer.getBody()).get("id").toString();
  }

}
