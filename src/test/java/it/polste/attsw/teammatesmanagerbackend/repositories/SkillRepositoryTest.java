package it.polste.attsw.teammatesmanagerbackend.repositories;

import it.polste.attsw.teammatesmanagerbackend.models.PersonalData;
import it.polste.attsw.teammatesmanagerbackend.models.Skill;
import it.polste.attsw.teammatesmanagerbackend.models.Teammate;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@RunWith(SpringRunner.class)
public class SkillRepositoryTest {

  private static final Logger logger =
          LoggerFactory.getLogger(SkillRepositoryTest.class);

  @Autowired
  private SkillRepository skillRepository;

  @Autowired
  private TestEntityManager testEntityManager;

  private Skill skill;

  @Before
  public void setup() {
    PersonalData personalData = new PersonalData("Stefano Vannucchi",
            "stefano.vannucchi@stud.unifi.it",
            "M",
            "Prato",
            "student",
            "https://semantic-ui.com/images/avatar/large/steve.jpg");

    Set<Teammate> teammates = new HashSet<>();
    teammates.add(new Teammate(1L, personalData, new HashSet<>()));

    skill = new Skill(null, "Spring Boot");
    skill.setTeammates(teammates);
  }

  @Test
  public void saveAndReadRecordWithRepositoryTest() {
    Skill persistedSkill = skillRepository.save(skill);
    List<Skill> skills = skillRepository.findAll();
    assertThat(skills).containsOnlyOnce(persistedSkill);

    logger.info("Persisted and retrieved entity with id: "
            + skills.get(0).getId());
  }

  @Test
  public void saveWithTestEntityManagerAndReadWithRepositoryTest() {
    Skill persistedSkill = testEntityManager.persistFlushFind(skill);
    List<Skill> skills = skillRepository.findAll();
    assertThat(skills).containsOnlyOnce(persistedSkill);

    logger.info("Persisted and retrieved entity with id: "
            + skills.get(0).getId());
  }

}
