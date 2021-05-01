package com.obai.auth.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.obai.auth.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PermisionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Permision.class);
        Permision permision1 = new Permision();
        permision1.setId(1L);
        Permision permision2 = new Permision();
        permision2.setId(permision1.getId());
        assertThat(permision1).isEqualTo(permision2);
        permision2.setId(2L);
        assertThat(permision1).isNotEqualTo(permision2);
        permision1.setId(null);
        assertThat(permision1).isNotEqualTo(permision2);
    }
}
