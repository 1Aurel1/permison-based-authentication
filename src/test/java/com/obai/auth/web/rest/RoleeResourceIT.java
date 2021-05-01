package com.obai.auth.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.obai.auth.IntegrationTest;
import com.obai.auth.domain.Rolee;
import com.obai.auth.repository.RoleeRepository;
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
 * Integration tests for the {@link RoleeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class RoleeResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/rolees";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private RoleeRepository roleeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRoleeMockMvc;

    private Rolee rolee;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Rolee createEntity(EntityManager em) {
        Rolee rolee = new Rolee().name(DEFAULT_NAME).description(DEFAULT_DESCRIPTION);
        return rolee;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Rolee createUpdatedEntity(EntityManager em) {
        Rolee rolee = new Rolee().name(UPDATED_NAME).description(UPDATED_DESCRIPTION);
        return rolee;
    }

    @BeforeEach
    public void initTest() {
        rolee = createEntity(em);
    }

    @Test
    @Transactional
    void createRolee() throws Exception {
        int databaseSizeBeforeCreate = roleeRepository.findAll().size();
        // Create the Rolee
        restRoleeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(rolee)))
            .andExpect(status().isCreated());

        // Validate the Rolee in the database
        List<Rolee> roleeList = roleeRepository.findAll();
        assertThat(roleeList).hasSize(databaseSizeBeforeCreate + 1);
        Rolee testRolee = roleeList.get(roleeList.size() - 1);
        assertThat(testRolee.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testRolee.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createRoleeWithExistingId() throws Exception {
        // Create the Rolee with an existing ID
        rolee.setId(1L);

        int databaseSizeBeforeCreate = roleeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRoleeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(rolee)))
            .andExpect(status().isBadRequest());

        // Validate the Rolee in the database
        List<Rolee> roleeList = roleeRepository.findAll();
        assertThat(roleeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = roleeRepository.findAll().size();
        // set the field null
        rolee.setName(null);

        // Create the Rolee, which fails.

        restRoleeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(rolee)))
            .andExpect(status().isBadRequest());

        List<Rolee> roleeList = roleeRepository.findAll();
        assertThat(roleeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllRolees() throws Exception {
        // Initialize the database
        roleeRepository.saveAndFlush(rolee);

        // Get all the roleeList
        restRoleeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(rolee.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getRolee() throws Exception {
        // Initialize the database
        roleeRepository.saveAndFlush(rolee);

        // Get the rolee
        restRoleeMockMvc
            .perform(get(ENTITY_API_URL_ID, rolee.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(rolee.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingRolee() throws Exception {
        // Get the rolee
        restRoleeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewRolee() throws Exception {
        // Initialize the database
        roleeRepository.saveAndFlush(rolee);

        int databaseSizeBeforeUpdate = roleeRepository.findAll().size();

        // Update the rolee
        Rolee updatedRolee = roleeRepository.findById(rolee.getId()).get();
        // Disconnect from session so that the updates on updatedRolee are not directly saved in db
        em.detach(updatedRolee);
        updatedRolee.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restRoleeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRolee.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedRolee))
            )
            .andExpect(status().isOk());

        // Validate the Rolee in the database
        List<Rolee> roleeList = roleeRepository.findAll();
        assertThat(roleeList).hasSize(databaseSizeBeforeUpdate);
        Rolee testRolee = roleeList.get(roleeList.size() - 1);
        assertThat(testRolee.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testRolee.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingRolee() throws Exception {
        int databaseSizeBeforeUpdate = roleeRepository.findAll().size();
        rolee.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRoleeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, rolee.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rolee))
            )
            .andExpect(status().isBadRequest());

        // Validate the Rolee in the database
        List<Rolee> roleeList = roleeRepository.findAll();
        assertThat(roleeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRolee() throws Exception {
        int databaseSizeBeforeUpdate = roleeRepository.findAll().size();
        rolee.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRoleeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rolee))
            )
            .andExpect(status().isBadRequest());

        // Validate the Rolee in the database
        List<Rolee> roleeList = roleeRepository.findAll();
        assertThat(roleeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRolee() throws Exception {
        int databaseSizeBeforeUpdate = roleeRepository.findAll().size();
        rolee.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRoleeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(rolee)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Rolee in the database
        List<Rolee> roleeList = roleeRepository.findAll();
        assertThat(roleeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRoleeWithPatch() throws Exception {
        // Initialize the database
        roleeRepository.saveAndFlush(rolee);

        int databaseSizeBeforeUpdate = roleeRepository.findAll().size();

        // Update the rolee using partial update
        Rolee partialUpdatedRolee = new Rolee();
        partialUpdatedRolee.setId(rolee.getId());

        partialUpdatedRolee.name(UPDATED_NAME);

        restRoleeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRolee.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRolee))
            )
            .andExpect(status().isOk());

        // Validate the Rolee in the database
        List<Rolee> roleeList = roleeRepository.findAll();
        assertThat(roleeList).hasSize(databaseSizeBeforeUpdate);
        Rolee testRolee = roleeList.get(roleeList.size() - 1);
        assertThat(testRolee.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testRolee.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateRoleeWithPatch() throws Exception {
        // Initialize the database
        roleeRepository.saveAndFlush(rolee);

        int databaseSizeBeforeUpdate = roleeRepository.findAll().size();

        // Update the rolee using partial update
        Rolee partialUpdatedRolee = new Rolee();
        partialUpdatedRolee.setId(rolee.getId());

        partialUpdatedRolee.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restRoleeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRolee.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRolee))
            )
            .andExpect(status().isOk());

        // Validate the Rolee in the database
        List<Rolee> roleeList = roleeRepository.findAll();
        assertThat(roleeList).hasSize(databaseSizeBeforeUpdate);
        Rolee testRolee = roleeList.get(roleeList.size() - 1);
        assertThat(testRolee.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testRolee.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingRolee() throws Exception {
        int databaseSizeBeforeUpdate = roleeRepository.findAll().size();
        rolee.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRoleeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, rolee.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(rolee))
            )
            .andExpect(status().isBadRequest());

        // Validate the Rolee in the database
        List<Rolee> roleeList = roleeRepository.findAll();
        assertThat(roleeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRolee() throws Exception {
        int databaseSizeBeforeUpdate = roleeRepository.findAll().size();
        rolee.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRoleeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(rolee))
            )
            .andExpect(status().isBadRequest());

        // Validate the Rolee in the database
        List<Rolee> roleeList = roleeRepository.findAll();
        assertThat(roleeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRolee() throws Exception {
        int databaseSizeBeforeUpdate = roleeRepository.findAll().size();
        rolee.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRoleeMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(rolee)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Rolee in the database
        List<Rolee> roleeList = roleeRepository.findAll();
        assertThat(roleeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRolee() throws Exception {
        // Initialize the database
        roleeRepository.saveAndFlush(rolee);

        int databaseSizeBeforeDelete = roleeRepository.findAll().size();

        // Delete the rolee
        restRoleeMockMvc
            .perform(delete(ENTITY_API_URL_ID, rolee.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Rolee> roleeList = roleeRepository.findAll();
        assertThat(roleeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
