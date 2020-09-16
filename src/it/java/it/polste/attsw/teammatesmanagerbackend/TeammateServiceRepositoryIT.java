package it.polste.attsw.teammatesmanagerbackend;

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
import static org.assertj.core.api.Assertions.assertThat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.HashSet;

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
    skills.add(new Skill(null, "skill"));
  }

  @Test
  public void serviceInsertsIntoRepositoryITTest() {
    Teammate saved = teammateService
            .insertNewTeammate(new Teammate(null, personalData, skills));

    assertThat(teammateRepository.findById(saved.getId()))
            .isPresent();
    assertThat(skillRepository.findAll())
            .containsAll(skills);
  }

  @Test
  public void serviceUpdatesIntoRepositoryITTest() {
    skills.forEach(skill ->
            skill.setId(skillRepository.save(skill).getId()));

    Teammate saved = teammateRepository
            .save(new Teammate(null, personalData, skills));

    skills.add(new Skill(null, "skills"));

    Teammate updated = teammateService.updateTeammate(saved.getId(),
            new Teammate(saved.getId(), personalData, skills));

    assertThat(teammateRepository.findAll())
            .contains(updated);
    assertThat(updated.getSkills())
            .isEqualTo(skills);
  }

  @Test
  public void serviceDeletesFromRepositoryITTest() {
    Teammate saved = teammateRepository
            .save(new Teammate(null, personalData, skills));
    teammateService.deleteTeammate(saved.getId());

    assertThat(teammateRepository.findAll()).doesNotContain(saved);
  }

}
