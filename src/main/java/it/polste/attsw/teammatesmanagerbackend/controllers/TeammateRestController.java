package it.polste.attsw.teammatesmanagerbackend.controllers;

import it.polste.attsw.teammatesmanagerbackend.models.Teammate;
import it.polste.attsw.teammatesmanagerbackend.services.TeammateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teammates")
public class TeammateRestController {

  private final TeammateService teammateService;

  @Autowired
  public TeammateRestController(TeammateService teammateService) {
    this.teammateService = teammateService;
  }

  @GetMapping
  public List<Teammate> allTeammates() {
    return teammateService.getAllTeammates();
  }

  @PostMapping("/new")
  public Teammate newTeammate(@RequestBody Teammate teammate) {
    return teammateService.insertNewTeammate(teammate);
  }

  @PutMapping("/update/{id}")
  public Teammate updateTeammate(@PathVariable Long id, @RequestBody Teammate teammate) {
    return teammateService.updateTeammate(id, teammate);
  }

  @DeleteMapping("/delete/{id}")
  public void deleteTeammate(@PathVariable Long id) {
    teammateService.deleteTeammate(id);
  }

}
