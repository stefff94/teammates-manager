package it.polste.attsw.teammatesmanagerbackend;

import it.polste.attsw.teammatesmanagerbackend.exceptions.TeammateAlreadyExistsException;
import it.polste.attsw.teammatesmanagerbackend.models.PersonalData;
import it.polste.attsw.teammatesmanagerbackend.models.Skill;
import it.polste.attsw.teammatesmanagerbackend.models.Teammate;
import it.polste.attsw.teammatesmanagerbackend.repositories.SkillRepository;
import it.polste.attsw.teammatesmanagerbackend.repositories.TeammateRepository;
import it.polste.attsw.teammatesmanagerbackend.services.SkillService;
import it.polste.attsw.teammatesmanagerbackend.services.TeammateService;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

import static java.util.concurrent.TimeUnit.SECONDS;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.fail;
import static org.awaitility.Awaitility.await;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@RunWith(SpringRunner.class)
@DataJpaTest
@Import({TeammateService.class, SkillService.class})
public class TeammateServiceRepositoryIT {

  @Autowired
  private TeammateService teammateService;

  @Autowired
  private SkillRepository skillRepository;

  @Autowired
  private TeammateRepository teammateRepository;

  private PersonalData personalData;
  private HashSet<Skill> skills;

  @Before
  public void setup(){
    personalData = new PersonalData("name1", "mail1",
            "male", "city1",
            "role1", "photoUrl1");
    skills = new HashSet<>();
    skills.add(new Skill(1L, "skill"));
  }

  @Test
  public void serviceInsertsIntoRepositoryITTest() {
    Teammate saved = teammateService
            .insertNewTeammate(new Teammate(null, personalData, skills));

    assertThat(teammateRepository.findById(saved.getId()))
            .isPresent();
    assertThat(skillRepository.findByNameIgnoreCase("skill"))
            .isNotNull();
  }

  @Test
  public void serviceUpdatesIntoRepositoryITTest() {
    Teammate saved = teammateRepository
            .save(new Teammate(null, personalData, skills));
    skills.add(new Skill(2L, "skills"));
    Teammate updated = teammateService.updateTeammate(saved.getId(),
            new Teammate(saved.getId(), personalData, skills));

    assertThat(teammateRepository.findAll())
            .contains(updated);
    assertThat(skillRepository.findAll())
            .containsAll(skills);
  }

  @Test
  public void serviceDeletesFromRepositoryITTest() {
    Teammate saved = teammateRepository
            .save(new Teammate(null, personalData, skills));
    teammateService.deleteTeammate(saved.getId());

    assertThat(teammateRepository.findAll()).doesNotContain(saved);
  }

  @Test
  public void insertNewTeammateConcurrentlyThrowsTeammateAlreadyExistsExceptionIfSameMailITTest(){
    List<Teammate> returnedTeammates = new ArrayList<>();
    int expectedSkillAmount = skillRepository.findAll().size() + 1;
    PersonalData personalData = new PersonalData("Mario Rossi",
            "mariorossi@mail.it",
            "male",
            "Roma",
            "Student",
            "photoUrl");

    try {
      List<Thread> threads = IntStream.range(0, 10)
              .mapToObj(tId -> new Thread(
                      () -> {
                        HashSet<Skill> skills = new HashSet<>();
                        skills.add(new Skill(null, "skill" + tId));
                        returnedTeammates.add(teammateService
                                .insertNewTeammate(
                                        new Teammate(null, personalData, skills)));
                      }
              ))
              .peek(Thread::start)
              .collect(Collectors.toList());

      await().atMost(60, SECONDS)
              .until(() -> threads.stream().noneMatch(Thread::isAlive));
      fail("insertNewTeammate failed," +
              " it did not throw TeammateAlreadyExistException when expected");

    }catch(TeammateAlreadyExistsException e){
      assertThat(teammateRepository.findAll().size())
              .isEqualTo(1);
      assertThat(returnedTeammates.stream()
              .distinct().limit(2).count())
              .isEqualTo(1);
      assertThat(skillRepository.findAll().size())
              .isEqualTo(expectedSkillAmount);
    }
  }

}
