package it.polste.attsw.teammatesmanagerbackend;

import io.restassured.RestAssured;
import it.polste.attsw.teammatesmanagerbackend.models.Skill;
import it.polste.attsw.teammatesmanagerbackend.repositories.SkillRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.junit4.SpringRunner;

import static io.restassured.RestAssured.when;
import static org.hamcrest.CoreMatchers.hasItems;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class SkillRestControllerIT {

  @Autowired
  private SkillRepository skillRepository;

  @LocalServerPort
  private int port;

  @Before
  public void setup() {
    RestAssured.port = port;

    // start all tests with an empty database
    skillRepository.deleteAll();
    skillRepository.flush();
  }

  @Test
  public void testGetAllSkills() {
    Skill savedSkill1 = skillRepository
            .save(new Skill(null, "Artificial Intelligence"));
    Skill savedSkill2 = skillRepository
            .save(new Skill(null, "Cyber Security"));

    when().
            get("api/skills/").
    then().
            statusCode(HttpStatus.OK.value()).
            assertThat().
            body(
                    "id", hasItems(savedSkill1.getId().intValue(), savedSkill2.getId().intValue()),
                    "name", hasItems(savedSkill1.getName(), savedSkill1.getName())
            );
  }
}
