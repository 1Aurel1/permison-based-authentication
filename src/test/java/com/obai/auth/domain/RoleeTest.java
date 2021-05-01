package com.obai.auth.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.obai.auth.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class RoleeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Rolee.class);
        Rolee rolee1 = new Rolee();
        rolee1.setId(1L);
        Rolee rolee2 = new Rolee();
        rolee2.setId(rolee1.getId());
        assertThat(rolee1).isEqualTo(rolee2);
        rolee2.setId(2L);
        assertThat(rolee1).isNotEqualTo(rolee2);
        rolee1.setId(null);
        assertThat(rolee1).isNotEqualTo(rolee2);
    }
}
