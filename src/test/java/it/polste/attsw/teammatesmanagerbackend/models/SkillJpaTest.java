package it.polste.attsw.teammatesmanagerbackend.models;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.junit4.SpringRunner;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@RunWith(SpringRunner.class)
public class SkillJpaTest {

  private static final Logger logger =
          LoggerFactory.getLogger(SkillJpaTest.class);

  @Autowired
  private TestEntityManager entityManager;

  @Test
  public void testJpaMapping() {
    Skill skill =
            entityManager.persistFlushFind(
                    new Skill(null, "Spring Boot"));

    assertThat(skill.getName()).isEqualTo("Spring Boot");
    assertThat(skill.getId()).isNotNull();
    assertThat(skill.getId()).isPositive();

    logger.info("Persisted entity with id: " + skill.getId());
  }

}
