package it.polste.attsw.teammatesmanagerbackend.services;

import it.polste.attsw.teammatesmanagerbackend.models.Skill;
import it.polste.attsw.teammatesmanagerbackend.repositories.SkillRepository;

import java.util.List;
import java.util.Optional;

import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

@Service
public class SkillService {

  private final SkillRepository skillRepository;

  public SkillService(SkillRepository skillRepository) {
    this.skillRepository = skillRepository;
  }

  public List<Skill> getAllSkills() {
    return skillRepository.findAll();
  }

  public Skill insertNewSkill(Skill skill) {
    Optional<Skill> savedSkill = skillRepository
            .findSkillByNameIgnoreCase(skill.getName());

    if (savedSkill.isPresent())
      return savedSkill.get();
    else {
      skill.setId(null);
      try {
        return skillRepository.save(skill);
      }catch(ConstraintViolationException | DataIntegrityViolationException e) {
        return skillRepository
                .findByNameIgnoreCase(skill.getName());
      }
    }
  }

  public void removeOrphanSkills() {
    skillRepository.findAll().forEach(skill -> {
      if (skill.getTeammates().isEmpty()) {
        skillRepository.delete(skill);
      }
    });
  }
}
