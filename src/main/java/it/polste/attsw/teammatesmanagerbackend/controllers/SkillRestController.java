package it.polste.attsw.teammatesmanagerbackend.controllers;

import it.polste.attsw.teammatesmanagerbackend.models.Skill;
import it.polste.attsw.teammatesmanagerbackend.services.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
public class SkillRestController {

  private final SkillService skillService;

  @Autowired
  public SkillRestController(SkillService skillService) {
    this.skillService = skillService;
  }

  @GetMapping
  public List<Skill> allSkills() {
    return skillService.getAllSkills();
  }
}
