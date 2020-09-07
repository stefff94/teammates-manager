package it.polste.attsw.teammatesmanagerbackend.models;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "skills")
public class Skill {

  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(unique = true, length = 30)
  private String name;

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
