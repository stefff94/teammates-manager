package it.polste.attsw.teammatesmanagerbackend.models;

import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.junit4.SpringRunner;

import javax.persistence.PersistenceException;
import java.util.HashSet;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@RunWith(SpringRunner.class)
public class TeammateJpaTest {

  private static final Logger logger =
          LoggerFactory.getLogger(TeammateJpaTest.class);

  @Autowired
  private TestEntityManager entityManager;

  @Rule
  public ExpectedException thrown = ExpectedException.none();

  private PersonalData personalData;

  private Set<Skill> skills;

  @Before
  public void setup() {
    personalData = new PersonalData("Stefano Vannucchi",
            "stefano.vannucchi@stud.unifi.it",
            "M",
            "Prato",
            "student",
            "https://semantic-ui.com/images/avatar/large/steve.jpg");

    skills = new HashSet<>();
    skills.add(new Skill(1L, "Java"));
    skills.add(new Skill(2L, "Vue js"));
  }

  @Test
  public void testJpaMapping() {
    Teammate teammate =
            entityManager.persistFlushFind(new Teammate(null, personalData, skills));

    assertThat(teammate.getPersonalData()).isEqualTo(personalData);
    assertThat(teammate.getSkills())
            .containsExactlyInAnyOrderElementsOf(skills);
    assertThat(teammate.getId()).isNotNull();
    assertThat(teammate.getId()).isPositive();

    logger.info("Persisted entity with id:" + teammate.getId());
  }

  @Test
  public void testJpaMappingWhenMultipleTeammateWithSameEmail() {
    PersonalData personalDataCopy = new PersonalData("Stefano Vannucchi",
            "stefano.vannucchi@stud.unifi.it",
            "M",
            "Prato",
            "student",
            "https://semantic-ui.com/images/avatar/large/steve.jpg");

    Teammate teammate =
            entityManager.persistFlushFind(new Teammate(null, personalData, skills));

    logger.info("Persisted entity with id:" + teammate.getId());

    thrown.expect(PersistenceException.class);
    thrown.expectMessage("could not execute statement");
    entityManager.persist(new Teammate(null, personalDataCopy, skills));
  }

}
