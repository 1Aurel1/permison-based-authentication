package com.obai.auth.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.obai.auth.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ResouceTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Resouce.class);
        Resouce resouce1 = new Resouce();
        resouce1.setId(1L);
        Resouce resouce2 = new Resouce();
        resouce2.setId(resouce1.getId());
        assertThat(resouce1).isEqualTo(resouce2);
        resouce2.setId(2L);
        assertThat(resouce1).isNotEqualTo(resouce2);
        resouce1.setId(null);
        assertThat(resouce1).isNotEqualTo(resouce2);
    }
}
