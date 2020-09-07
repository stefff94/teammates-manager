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
    List<Skill> skills = skillRepository.findAll();

    Optional<Skill> savedSkill = skills.stream()
            .filter(s -> s.getName()
                    .equalsIgnoreCase(skill.getName().toLowerCase()))
            .findFirst();

    if (savedSkill.isPresent()) {
      return savedSkill.get();
    } else {
      skill.setId(null);
      try {
        return skillRepository.save(skill);
      }catch(ConstraintViolationException | DataIntegrityViolationException e){
        return skillRepository
                .findByNameIgnoreCase(skill.getName());
      }
    }
  }
}
