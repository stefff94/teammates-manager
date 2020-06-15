package it.polste.attsw.teammatesmanagerbackend.services;

import it.polste.attsw.teammatesmanagerbackend.models.Skill;
import it.polste.attsw.teammatesmanagerbackend.models.Teammate;
import it.polste.attsw.teammatesmanagerbackend.repositories.TeammateRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class TeammateService {

    private final TeammateRepository teammateRepository;

    public TeammateService(TeammateRepository teammateRepository){
        this.teammateRepository = teammateRepository;
    }

    public List<Teammate> getAllTeammates(){
        return teammateRepository.findAll();
    }

    public Teammate insertNewTeammate(Teammate teammate){
        teammate.setId(null);
        return teammateRepository.save(teammate);
    }
}
