package it.polste.attsw.teammatesmanagerbackend;

import it.polste.attsw.teammatesmanagerbackend.models.Skill;
import it.polste.attsw.teammatesmanagerbackend.repositories.SkillRepository;
import it.polste.attsw.teammatesmanagerbackend.services.SkillService;

import org.junit.Test;
import org.junit.runner.RunWith;
import static org.assertj.core.api.Assertions.assertThat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.junit4.SpringRunner;
import static org.awaitility.Awaitility.await;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import static java.util.concurrent.TimeUnit.SECONDS;

@RunWith(SpringRunner.class)
@DataJpaTest
@Import(SkillService.class)
public class SkillServiceRepositoryIT {

  @Autowired
  private SkillService skillService;

  @Autowired
  private SkillRepository skillRepository;

  @Test
  public void serviceInsertsIntoRepositoryITTest() {
    Skill saved = skillService
            .insertNewSkill(new Skill(null, "skillName"));

    assertThat(skillRepository.findById(saved.getId()))
            .isPresent();
  }

  @Test
  public void insertNewSkillConcurrentlyReturnsSameSkillITTest(){
    List<Skill> returnedSkills = new ArrayList<>();
    List<Thread> threads = IntStream.range(0, 10)
            .mapToObj(tId -> new Thread(
                    () ->
                            returnedSkills.add(skillService.insertNewSkill(new Skill(999L, "Skill")))
            ))
            .peek(Thread::start)
            .collect(Collectors.toList());

    await().atMost(60, SECONDS)
            .until(() -> threads.stream().noneMatch(Thread::isAlive));

    assertThat(skillRepository.findAll().size())
            .isEqualTo(3);
    assertThat(returnedSkills.stream()
            .distinct().limit(2).count())
            .isEqualTo(1);
  }

}
