package com.obai.auth.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.obai.auth.IntegrationTest;
import com.obai.auth.domain.Permision;
import com.obai.auth.repository.PermisionRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link PermisionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PermisionResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/permisions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PermisionRepository permisionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPermisionMockMvc;

    private Permision permision;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Permision createEntity(EntityManager em) {
        Permision permision = new Permision().name(DEFAULT_NAME).description(DEFAULT_DESCRIPTION);
        return permision;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Permision createUpdatedEntity(EntityManager em) {
        Permision permision = new Permision().name(UPDATED_NAME).description(UPDATED_DESCRIPTION);
        return permision;
    }

    @BeforeEach
    public void initTest() {
        permision = createEntity(em);
    }

    @Test
    @Transactional
    void createPermision() throws Exception {
        int databaseSizeBeforeCreate = permisionRepository.findAll().size();
        // Create the Permision
        restPermisionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(permision)))
            .andExpect(status().isCreated());

        // Validate the Permision in the database
        List<Permision> permisionList = permisionRepository.findAll();
        assertThat(permisionList).hasSize(databaseSizeBeforeCreate + 1);
        Permision testPermision = permisionList.get(permisionList.size() - 1);
        assertThat(testPermision.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testPermision.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createPermisionWithExistingId() throws Exception {
        // Create the Permision with an existing ID
        permision.setId(1L);

        int databaseSizeBeforeCreate = permisionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPermisionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(permision)))
            .andExpect(status().isBadRequest());

        // Validate the Permision in the database
        List<Permision> permisionList = permisionRepository.findAll();
        assertThat(permisionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = permisionRepository.findAll().size();
        // set the field null
        permision.setName(null);

        // Create the Permision, which fails.

        restPermisionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(permision)))
            .andExpect(status().isBadRequest());

        List<Permision> permisionList = permisionRepository.findAll();
        assertThat(permisionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllPermisions() throws Exception {
        // Initialize the database
        permisionRepository.saveAndFlush(permision);

        // Get all the permisionList
        restPermisionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(permision.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getPermision() throws Exception {
        // Initialize the database
        permisionRepository.saveAndFlush(permision);

        // Get the permision
        restPermisionMockMvc
            .perform(get(ENTITY_API_URL_ID, permision.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(permision.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingPermision() throws Exception {
        // Get the permision
        restPermisionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewPermision() throws Exception {
        // Initialize the database
        permisionRepository.saveAndFlush(permision);

        int databaseSizeBeforeUpdate = permisionRepository.findAll().size();

        // Update the permision
        Permision updatedPermision = permisionRepository.findById(permision.getId()).get();
        // Disconnect from session so that the updates on updatedPermision are not directly saved in db
        em.detach(updatedPermision);
        updatedPermision.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restPermisionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPermision.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPermision))
            )
            .andExpect(status().isOk());

        // Validate the Permision in the database
        List<Permision> permisionList = permisionRepository.findAll();
        assertThat(permisionList).hasSize(databaseSizeBeforeUpdate);
        Permision testPermision = permisionList.get(permisionList.size() - 1);
        assertThat(testPermision.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testPermision.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingPermision() throws Exception {
        int databaseSizeBeforeUpdate = permisionRepository.findAll().size();
        permision.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPermisionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, permision.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(permision))
            )
            .andExpect(status().isBadRequest());

        // Validate the Permision in the database
        List<Permision> permisionList = permisionRepository.findAll();
        assertThat(permisionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPermision() throws Exception {
        int databaseSizeBeforeUpdate = permisionRepository.findAll().size();
        permision.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPermisionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(permision))
            )
            .andExpect(status().isBadRequest());

        // Validate the Permision in the database
        List<Permision> permisionList = permisionRepository.findAll();
        assertThat(permisionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPermision() throws Exception {
        int databaseSizeBeforeUpdate = permisionRepository.findAll().size();
        permision.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPermisionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(permision)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Permision in the database
        List<Permision> permisionList = permisionRepository.findAll();
        assertThat(permisionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePermisionWithPatch() throws Exception {
        // Initialize the database
        permisionRepository.saveAndFlush(permision);

        int databaseSizeBeforeUpdate = permisionRepository.findAll().size();

        // Update the permision using partial update
        Permision partialUpdatedPermision = new Permision();
        partialUpdatedPermision.setId(permision.getId());

        partialUpdatedPermision.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restPermisionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPermision.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPermision))
            )
            .andExpect(status().isOk());

        // Validate the Permision in the database
        List<Permision> permisionList = permisionRepository.findAll();
        assertThat(permisionList).hasSize(databaseSizeBeforeUpdate);
        Permision testPermision = permisionList.get(permisionList.size() - 1);
        assertThat(testPermision.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testPermision.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdatePermisionWithPatch() throws Exception {
        // Initialize the database
        permisionRepository.saveAndFlush(permision);

        int databaseSizeBeforeUpdate = permisionRepository.findAll().size();

        // Update the permision using partial update
        Permision partialUpdatedPermision = new Permision();
        partialUpdatedPermision.setId(permision.getId());

        partialUpdatedPermision.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restPermisionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPermision.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPermision))
            )
            .andExpect(status().isOk());

        // Validate the Permision in the database
        List<Permision> permisionList = permisionRepository.findAll();
        assertThat(permisionList).hasSize(databaseSizeBeforeUpdate);
        Permision testPermision = permisionList.get(permisionList.size() - 1);
        assertThat(testPermision.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testPermision.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingPermision() throws Exception {
        int databaseSizeBeforeUpdate = permisionRepository.findAll().size();
        permision.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPermisionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, permision.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(permision))
            )
            .andExpect(status().isBadRequest());

        // Validate the Permision in the database
        List<Permision> permisionList = permisionRepository.findAll();
        assertThat(permisionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPermision() throws Exception {
        int databaseSizeBeforeUpdate = permisionRepository.findAll().size();
        permision.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPermisionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(permision))
            )
            .andExpect(status().isBadRequest());

        // Validate the Permision in the database
        List<Permision> permisionList = permisionRepository.findAll();
        assertThat(permisionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPermision() throws Exception {
        int databaseSizeBeforeUpdate = permisionRepository.findAll().size();
        permision.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPermisionMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(permision))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Permision in the database
        List<Permision> permisionList = permisionRepository.findAll();
        assertThat(permisionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePermision() throws Exception {
        // Initialize the database
        permisionRepository.saveAndFlush(permision);

        int databaseSizeBeforeDelete = permisionRepository.findAll().size();

        // Delete the permision
        restPermisionMockMvc
            .perform(delete(ENTITY_API_URL_ID, permision.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Permision> permisionList = permisionRepository.findAll();
        assertThat(permisionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
