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

}
