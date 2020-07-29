package it.polste.attsw.teammatesmanagerbackend;

import io.restassured.RestAssured;
import io.restassured.response.Response;
import it.polste.attsw.teammatesmanagerbackend.models.PersonalData;
import it.polste.attsw.teammatesmanagerbackend.models.Skill;
import it.polste.attsw.teammatesmanagerbackend.models.Teammate;
import it.polste.attsw.teammatesmanagerbackend.repositories.SkillRepository;
import it.polste.attsw.teammatesmanagerbackend.repositories.TeammateRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static io.restassured.RestAssured.given;
import static io.restassured.RestAssured.when;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.CoreMatchers.hasItems;
import static org.hamcrest.Matchers.equalTo;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class TeammateRestControllerIT {

  @Autowired
  private TeammateRepository teammateRepository;

  @Autowired
  private SkillRepository skillRepository;

  @LocalServerPort
  private int port;

  private PersonalData stefanosData;
  private PersonalData paolosData;
  private Set<Skill> skills;

  @Before
  public void setup() {
    RestAssured.port = port;

    // start all tests with an empty database
    skillRepository.deleteAll();
    skillRepository.flush();
    teammateRepository.deleteAll();
    teammateRepository.flush();

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

    skills.add(skillRepository
            .save(new Skill(null, "Artificial Intelligence")));
    skills.add(skillRepository
            .save(new Skill(null, "Cyber Security")));
  }

  @Test
  public void testInsertNewTeammate() {
    Teammate teammateToInsert = new Teammate(null, stefanosData, skills);

    Response response = given().
            contentType(MediaType.APPLICATION_JSON_VALUE).
            body(teammateToInsert).
    when().
            post("/api/teammates/new");

    Teammate savedTeammate = response.getBody().as(Teammate.class);

    assertThat(teammateRepository.findById(savedTeammate.getId()))
            .contains(savedTeammate);
  }

  @Test
  public void testUpdateTeammate() {
    Teammate savedTeammate = teammateRepository
            .save(new Teammate(null, stefanosData, skills));

    Teammate teammateToUpdate = new Teammate(null, paolosData, skills);

    final List<Integer> savedSkills = savedTeammate.getSkills()
            .stream()
            .map(s -> s.getId().intValue())
            .collect(Collectors.toList());

    given().
            contentType(MediaType.APPLICATION_JSON_VALUE).
            body(teammateToUpdate).
    when().
            put("/api/teammates/update/" + savedTeammate.getId()).
    then().
            statusCode(HttpStatus.OK.value()).
            assertThat().
            body(
                    "id", equalTo(savedTeammate.getId().intValue()),
                    "personalData.name", equalTo("Paolo Innocenti"),
                    "personalData.email", equalTo("paolo.innocenti@stud.unifi.it"),
                    "personalData.gender", equalTo("M"),
                    "personalData.city", equalTo("Pistoia"),
                    "personalData.role", equalTo("student"),
                    "personalData.photoUrl", equalTo(
                            "https://semantic-ui.com/images/avatar/large/elliot.jpg"),
                    "skills.id", hasItems(savedSkills.get(0), savedSkills.get(1)),
                    "skills.name", hasItems("Artificial Intelligence", "Cyber Security")
            );
  }

  @Test
  public void testDeleteTeammate() {
    Teammate savedTeammate = teammateRepository
            .save(new Teammate(null, stefanosData, skills));

    when().
            delete("api/teammates/delete/" + savedTeammate.getId()).
    then().
            statusCode(HttpStatus.OK.value());

    assertThat(teammateRepository.findById(savedTeammate.getId()))
            .isNotPresent();
  }
}
