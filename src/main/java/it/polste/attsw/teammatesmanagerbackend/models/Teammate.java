package it.polste.attsw.teammatesmanagerbackend.models;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "teammates")
public class Teammate {

  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Embedded
  private PersonalData personalData;

  @ManyToMany(fetch = FetchType.EAGER,
          cascade = {CascadeType.MERGE, CascadeType.REFRESH})
  @JoinTable(name = "teammate_skills",
          joinColumns = { @JoinColumn(name = "teammate_id") },
          inverseJoinColumns = { @JoinColumn(name = "skill_id") })
  private Set<Skill> skills = new HashSet<>();

  public Teammate() {}

  public Teammate(Long id,
                  PersonalData personalData,
                  Set<Skill> skills) {

    this.id = id;
    this.personalData = personalData;
    this.skills = skills;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public PersonalData getPersonalData() {
    return personalData;
  }

  public void setPersonalData(PersonalData personalData) {
    this.personalData = personalData;
  }

  public Set<Skill> getSkills() {
    return skills;
  }

  public void setSkills(Set<Skill> skills) {
    this.skills = skills;
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, personalData, skills);
  }

  @Override
  public boolean equals(Object obj) {
    if (this == obj)
      return true;
    if (obj == null)
      return false;
    if (getClass() != obj.getClass())
      return false;
    Teammate other = (Teammate) obj;
    return Objects.equals(id, other.id)
            && Objects.equals(personalData, other.personalData)
            && Objects.equals(skills, other.skills);
  }
}
