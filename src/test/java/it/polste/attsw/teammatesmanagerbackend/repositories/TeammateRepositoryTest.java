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
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@RunWith(SpringRunner.class)
public class TeammateRepositoryTest {

  private static final Logger logger =
          LoggerFactory.getLogger(TeammateRepositoryTest.class);

  @Autowired
  private TeammateRepository teammateRepository;

  @Autowired
  private TestEntityManager testEntityManager;

  private Teammate teammate;

  @Before
  public void setup() {
    PersonalData personalData = new PersonalData("Stefano Vannucchi",
            "stefano.vannucchi@stud.unifi.it",
            "M",
            "Prato",
            "student",
            "https://semantic-ui.com/images/avatar/large/steve.jpg");

    Set<Skill> skills = new HashSet<>();
    skills.add(new Skill(1L, "Java"));
    skills.add(new Skill(2L, "Vue js"));

    teammate = new Teammate(null, personalData, skills);
  }

  @Test
  public void saveAndReadRecordWithRepositoryTest() {
    Teammate persistedTeammate = teammateRepository.save(teammate);
    List<Teammate> teammates = teammateRepository.findAll();
    assertThat(teammates).containsExactly(persistedTeammate);

    logger.info("Persisted and retrieved entity with id: "
            + teammates.get(0).getId());
  }

  @Test
  public void saveWithTestEntityManagerAndReadWithRepositoryTest() {
    Teammate persistedTeammate = testEntityManager.persistFlushFind(teammate);
    List<Teammate> teammates = teammateRepository.findAll();
    assertThat(teammates).containsExactly(persistedTeammate);

    logger.info("Persisted and retrieved entity with id: "
            + teammates.get(0).getId());
  }

  @Test
  public void findTeammateByEmailTest() {
    Teammate persistedTeammate = testEntityManager.persistFlushFind(teammate);

    Teammate foundTeammate = new Teammate();

    final Optional<Teammate> toFindTeammate = teammateRepository
            .findTeammateByPersonalDataEmailIgnoreCase("stefano.vannucchi@stud.unifi.it");

    if (toFindTeammate.isPresent()) {
      foundTeammate = toFindTeammate.get();
    }

    assertThat(foundTeammate).isEqualTo(persistedTeammate);

    logger.info("Persisted and retrieved entity with email: "
            + foundTeammate.getPersonalData().getEmail());
  }

  @Test
  public void findByPersonalDataEmailIgnoreCaseTestReturnsExistingTeammateTest(){
    Teammate persistedTeammate = testEntityManager.persistFlushFind(teammate);

    final Teammate savedTeammate = teammateRepository
            .findByPersonalDataEmailIgnoreCase(teammate
            .getPersonalData()
            .getEmail());

    assertThat(savedTeammate)
            .isEqualTo(persistedTeammate);
  }

}
