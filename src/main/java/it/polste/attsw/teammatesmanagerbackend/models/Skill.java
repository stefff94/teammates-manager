package it.polste.attsw.teammatesmanagerbackend.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "skills")
@JsonIgnoreProperties(value= {"teammates"})
public class Skill {

  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(unique = true, length = 30)
  private String name;

  @ManyToMany(mappedBy = "skills")
  private Set<Teammate> teammates = new HashSet<>();

  public Skill() {}

  public Skill(Long id, String name) {
    this.id = id;
    this.name = name;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Set<Teammate> getTeammates() {
    return teammates;
  }

  public void setTeammates(Set<Teammate> teammates) {
    this.teammates = teammates;
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, name);
  }

  @Override
  public boolean equals(Object obj) {
    if (this == obj)
      return true;
    if (obj == null)
      return false;
    if (getClass() != obj.getClass())
      return false;
    Skill other = (Skill) obj;
    return Objects.equals(id, other.id)
            && Objects.equals(name, other.name);
  }
}
