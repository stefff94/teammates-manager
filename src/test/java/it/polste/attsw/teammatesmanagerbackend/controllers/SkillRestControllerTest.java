package it.polste.attsw.teammatesmanagerbackend.controllers;

import io.restassured.module.mockmvc.RestAssuredMockMvc;
import it.polste.attsw.teammatesmanagerbackend.models.Skill;
import it.polste.attsw.teammatesmanagerbackend.services.SkillService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.Arrays;

import static org.hamcrest.CoreMatchers.*;
import static org.mockito.Mockito.when;
import static io.restassured.module.mockmvc.RestAssuredMockMvc.when;
import static org.hamcrest.Matchers.empty;

@RunWith(MockitoJUnitRunner.class)
public class SkillRestControllerTest {

  @Mock
  private SkillService skillService;

  @InjectMocks
  private SkillRestController skillRestController;

  @Before
  public void setup() {
    RestAssuredMockMvc.standaloneSetup(skillRestController);
  }

  @Test
  public void testGetAllSkillsWhenEmpty() {
    when().
            get("/api/skills").
    then().
            statusCode(200).
            assertThat().
            body("", empty());
  }

  @Test
  public void testGetAllSkillsWhenNotEmpty() {
    when(skillService.getAllSkills())
            .thenReturn(Arrays.asList(
                    new Skill(1L, "Spring Boot"),
                    new Skill(2L, "Vue js")
            ));

    when().
            get("/api/skills").
    then().
            statusCode(200).
            assertThat().
            body(
                    "id", hasItems(1, 2),
                    "name", hasItems("Spring Boot", "Vue js")
            );
  }

}
