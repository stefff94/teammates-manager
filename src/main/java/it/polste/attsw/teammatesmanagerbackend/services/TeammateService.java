package it.polste.attsw.teammatesmanagerbackend.services;

import it.polste.attsw.teammatesmanagerbackend.exceptions.TeammateAlreadyExistsException;
import it.polste.attsw.teammatesmanagerbackend.exceptions.TeammateNotExistsException;
import it.polste.attsw.teammatesmanagerbackend.models.Skill;
import it.polste.attsw.teammatesmanagerbackend.models.Teammate;
import it.polste.attsw.teammatesmanagerbackend.repositories.TeammateRepository;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class TeammateService {

  private final TeammateRepository teammateRepository;
  private final SkillService skillService;

  public TeammateService(TeammateRepository teammateRepository,
                         SkillService skillService) {

    this.teammateRepository = teammateRepository;
    this.skillService = skillService;
  }

  public List<Teammate> getAllTeammates(){
    return teammateRepository.findAll();
  }

  public Teammate insertNewTeammate(Teammate teammate) {
    if (!teammateMailIsDuplicate(teammate, null)) {
      return setTeammateData(null, teammate);
    } else {
      String message = "This mail has already been associated with a Teammate";
      throw new TeammateAlreadyExistsException(message);
    }
  }

  private boolean teammateMailIsDuplicate(Teammate teammate, Long id) {
    String mail = teammate.getPersonalData().getEmail();
    Optional<Teammate> existingMail =
            teammateRepository.findTeammateByPersonalDataEmailIgnoreCase(mail);

    if (existingMail.isPresent() && existingMail.get().getId().equals(id)) {
      return false;
    } else {
      return existingMail.isPresent();
    }
  }

  private Teammate setTeammateData(Long id, Teammate teammate) {
    teammate.setId(id);

    Set<Skill> savedSkills =
            saveSkillsForTeammate(teammate.getSkills());
    teammate.setSkills(savedSkills);

    try {
      return teammateRepository.save(teammate);
    }catch(ConstraintViolationException | DataIntegrityViolationException e) {
      String message = "Can not create a teammate with an already used emaila";
      throw new TeammateAlreadyExistsException(message);
    }
  }

  private Set<Skill> saveSkillsForTeammate(Set<Skill> skills) {
    Set<Skill> teammateSkills = new HashSet<>();
    skills.forEach(skill ->
            teammateSkills.add(skillService.insertNewSkill(skill)));

    return teammateSkills;
  }

  public Teammate updateTeammate(Long id, Teammate teammate) {
    if (teammateMailIsDuplicate(teammate, id)) {
      String message = "This mail has already been associated with a Teammate";
      throw new TeammateAlreadyExistsException(message);
    }

    Optional<Teammate> existingTeammate = teammateRepository.findById(id);
    if (existingTeammate.isPresent()) {
      return setTeammateData(id, teammate);
    } else {
      String message = "No Teammate with id " + id + " exists!";
      throw new TeammateNotExistsException(message);
    }
  }

  public void deleteTeammate(Long id) {
    Optional<Teammate> teammate = teammateRepository.findById(id);

    if (teammate.isPresent()) {
      teammateRepository.deleteById(id);
    } else {
      String message = "No Teammate with id " + id + " exists!";
      throw new TeammateNotExistsException(message);
    }

  }
}
