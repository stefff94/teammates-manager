package it.polste.attsw.teammatesmanagerbackend.services;

import it.polste.attsw.teammatesmanagerbackend.exceptions.TeammateAlreadyExistsException;
import it.polste.attsw.teammatesmanagerbackend.exceptions.TeammateNotExistsException;
import it.polste.attsw.teammatesmanagerbackend.models.PersonalData;
import it.polste.attsw.teammatesmanagerbackend.models.Skill;
import it.polste.attsw.teammatesmanagerbackend.models.Teammate;
import it.polste.attsw.teammatesmanagerbackend.repositories.TeammateRepository;

import java.util.*;

import static java.util.Arrays.asList;

import org.hibernate.exception.ConstraintViolationException;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.rules.ExpectedException;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.mockito.InOrder;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;


@RunWith(MockitoJUnitRunner.class)
public class TeammateServiceTest {

  private static final Logger logger = LoggerFactory.getLogger(TeammateServiceTest.class);

  @Mock
  private TeammateRepository teammateRepository;

  @Mock
  private SkillService skillService;

  @InjectMocks
  private TeammateService teammateService;

  @Rule
  public final ExpectedException thrown = ExpectedException.none();

  private PersonalData personalData1;
  private PersonalData personalData2;
  private Set<Skill> savedSkills;
  private Set<Skill> toSaveSkills;
  private Skill savedSkill;
  private Skill skillToSave;

  @Before
  public void setup() {
    personalData1 = new PersonalData("name1", "mail1",
            "male", "city1",
            "role1", "photoUrl1");
    personalData2 = new PersonalData("name2", "mail2",
            "female", "city2",
            "role2", "photoUrl2");

    savedSkills = new HashSet<>();
    savedSkill = new Skill(1L, "skill");
    savedSkills.add(savedSkill);

    toSaveSkills = new HashSet<>();
    skillToSave = new Skill(999L, "skill");
    toSaveSkills.add(skillToSave);
  }

  @Test
  public void getAllTeammatesTest() {
    Teammate teammate1 = new Teammate(1L, personalData1, savedSkills);
    Teammate teammate2 = new Teammate(2L, personalData2, savedSkills);

    when(teammateRepository.findAll())
            .thenReturn(asList(teammate1, teammate2));
    List<Teammate> result = teammateService.getAllTeammates();

    assertThat(result).containsExactly(teammate1, teammate2);
    logger.info("Recovered " + result.size() + " teammates");
  }

  @Test
  public void insertNewTeammateReturnsSavedTeammateWithIdTest() {
    Teammate saved = new Teammate(1L, personalData1, savedSkills);
    Teammate toSave = spy(new Teammate(999L, personalData2, toSaveSkills));

    when(skillService.insertNewSkill(any(Skill.class)))
            .thenReturn(savedSkill);
    when(teammateRepository.save(any(Teammate.class)))
            .thenReturn(saved);

    Teammate result = teammateService.insertNewTeammate(toSave);

    assertThat(result).isSameAs(saved);
    assertThat(toSave.getSkills()).isEqualTo(savedSkills);
    verify(skillService, times(toSave.getSkills().size()))
            .insertNewSkill(skillToSave);

    logger.info("Inserted new teammate with id: " + saved.getId());

    InOrder inOrder = inOrder(toSave, skillService, teammateRepository);
    inOrder.verify(toSave).setId(null);
    inOrder.verify(skillService).insertNewSkill(skillToSave);
    inOrder.verify(teammateRepository).save(toSave);
  }

  @Test
  public void insertNewTeammateThrowsIllegalArgumentExceptionIfMailExistsTest() {
    Teammate saved = new Teammate(1L, personalData1, savedSkills);
    Teammate toSave = new Teammate(999L, personalData1, toSaveSkills);

    when(teammateRepository.findTeammateByPersonalDataEmailIgnoreCase(toSave.getPersonalData().getEmail()))
            .thenReturn(Optional.of(saved));
    thrown.expect(TeammateAlreadyExistsException.class);
    thrown.expectMessage("This mail has already been associated with a Teammate");

    teammateService.insertNewTeammate(toSave);
  }

  @Test
  public void deleteTeammateSucceedsWithExistingTeammateTest() {
    Teammate teammate = new Teammate(1L, personalData1, savedSkills);

    when(teammateRepository.findById(1L)).thenReturn(Optional.of(teammate));
    teammateService.deleteTeammate(1L);

    verify(teammateRepository, times(1)).deleteById(1L);
    logger.info("Deleted teammate with id: " + teammate.getId());
  }

  @Test
  public void deleteTeammateThrowsIllegalArgumentExceptionWithTeammateMissingTest() {
    when(teammateRepository.findById(any(Long.class)))
            .thenReturn(Optional.empty());

    thrown.expect(TeammateNotExistsException.class);
    thrown.expectMessage("No Teammate with id 1 exists!");

    teammateService.deleteTeammate(1L);
  }

  @Test
  public void updateTeammateByIdReturnsUpdatedTeammateWithPreviousIdTest() {
    Teammate replacement = spy(new Teammate(null, personalData1, toSaveSkills));
    Teammate replaced = new Teammate(1L, personalData1, savedSkills);

    when(skillService.insertNewSkill(any(Skill.class)))
            .thenReturn(savedSkill);
    when(teammateRepository.findById(1L))
            .thenReturn(Optional.of(replaced));
    when(teammateRepository.findTeammateByPersonalDataEmailIgnoreCase(any(String.class)))
            .thenReturn(Optional.of(replaced));
    when(teammateRepository.save(any(Teammate.class)))
            .thenReturn(replaced);

    Teammate result = teammateService.updateTeammate(1L, replacement);

    assertThat(result).isSameAs(replaced);
    assertThat(replacement.getSkills()).isEqualTo(savedSkills);

    InOrder inOrder = inOrder(replacement, skillService, teammateRepository);
    inOrder.verify(replacement).setId(1L);
    inOrder.verify(skillService).insertNewSkill(skillToSave);
    inOrder.verify(teammateRepository).save(replacement);
    logger.info("Updated teammate with id: " + replaced.getId());
  }

  @Test
  public void updateTeammateByIdThrowsIllegalArgumentExceptionIfTeammateIsMissingTest() {
    Teammate toSave = new Teammate(999L, personalData1, toSaveSkills);
    when(teammateRepository.findById(any(Long.class)))
            .thenReturn(Optional.empty());

    thrown.expect(TeammateNotExistsException.class);
    thrown.expectMessage("No Teammate with id 1 exists!");

    teammateService.updateTeammate(1L, toSave);
  }

  @Test
  public void updateTeammateByIdThrowsIllegalArgumentExceptionIfMailExistsForDifferentIdTest() {
    Teammate saved = new Teammate(1L, personalData1, savedSkills);
    Teammate toSave = new Teammate(999L, personalData1, toSaveSkills);
    when(teammateRepository.findTeammateByPersonalDataEmailIgnoreCase(saved.getPersonalData().getEmail()))
            .thenReturn(Optional.of(saved));

    thrown.expect(TeammateAlreadyExistsException.class);
    thrown.expectMessage("This mail has already been associated with a Teammate");

    teammateService.updateTeammate(2L, toSave);
  }

  @Test
  public void insertNewTeammateReturnsExistingTeammateIfCalledConcurrentlyWithDataIntegrityViolationExceptionTest(){
    Teammate toSave = new Teammate(999L, personalData1, savedSkills);
    Teammate saved = new Teammate(1L, personalData1, savedSkills);

    when(teammateRepository.save(any(Teammate.class)))
            .thenThrow(DataIntegrityViolationException.class);
    when(teammateRepository.findByPersonalDataEmailIgnoreCase(any(String.class)))
            .thenReturn(saved);

    Teammate teammate = teammateService.insertNewTeammate(toSave);

    assertThat(teammate)
            .isEqualTo(saved);
  }

  @Test
  public void insertNewTeammateReturnsExistingTeammateIfCalledConcurrentlyWithConstraintViolationExceptionTest(){
    Teammate toSave = new Teammate(999L, personalData1, savedSkills);
    Teammate saved = new Teammate(1L, personalData1, savedSkills);

    when(teammateRepository.save(any(Teammate.class)))
            .thenThrow(ConstraintViolationException.class);
    when(teammateRepository.findByPersonalDataEmailIgnoreCase(any(String.class)))
            .thenReturn(saved);

    Teammate teammate = teammateService.insertNewTeammate(toSave);

    assertThat(teammate)
            .isEqualTo(saved);
  }

}
