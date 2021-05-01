package com.obai.auth.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.obai.auth.IntegrationTest;
import com.obai.auth.domain.Resouce;
import com.obai.auth.repository.ResouceRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ResouceResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ResouceResourceIT {

    private static final String DEFAULT_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_ADDRESS = "BBBBBBBBBB";

    private static final String DEFAULT_METHOD = "AAAAAAAAAA";
    private static final String UPDATED_METHOD = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/resouces";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ResouceRepository resouceRepository;

    @Mock
    private ResouceRepository resouceRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restResouceMockMvc;

    private Resouce resouce;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Resouce createEntity(EntityManager em) {
        Resouce resouce = new Resouce().address(DEFAULT_ADDRESS).method(DEFAULT_METHOD).description(DEFAULT_DESCRIPTION);
        return resouce;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Resouce createUpdatedEntity(EntityManager em) {
        Resouce resouce = new Resouce().address(UPDATED_ADDRESS).method(UPDATED_METHOD).description(UPDATED_DESCRIPTION);
        return resouce;
    }

    @BeforeEach
    public void initTest() {
        resouce = createEntity(em);
    }

    @Test
    @Transactional
    void createResouce() throws Exception {
        int databaseSizeBeforeCreate = resouceRepository.findAll().size();
        // Create the Resouce
        restResouceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(resouce)))
            .andExpect(status().isCreated());

        // Validate the Resouce in the database
        List<Resouce> resouceList = resouceRepository.findAll();
        assertThat(resouceList).hasSize(databaseSizeBeforeCreate + 1);
        Resouce testResouce = resouceList.get(resouceList.size() - 1);
        assertThat(testResouce.getAddress()).isEqualTo(DEFAULT_ADDRESS);
        assertThat(testResouce.getMethod()).isEqualTo(DEFAULT_METHOD);
        assertThat(testResouce.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createResouceWithExistingId() throws Exception {
        // Create the Resouce with an existing ID
        resouce.setId(1L);

        int databaseSizeBeforeCreate = resouceRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restResouceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(resouce)))
            .andExpect(status().isBadRequest());

        // Validate the Resouce in the database
        List<Resouce> resouceList = resouceRepository.findAll();
        assertThat(resouceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkAddressIsRequired() throws Exception {
        int databaseSizeBeforeTest = resouceRepository.findAll().size();
        // set the field null
        resouce.setAddress(null);

        // Create the Resouce, which fails.

        restResouceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(resouce)))
            .andExpect(status().isBadRequest());

        List<Resouce> resouceList = resouceRepository.findAll();
        assertThat(resouceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkMethodIsRequired() throws Exception {
        int databaseSizeBeforeTest = resouceRepository.findAll().size();
        // set the field null
        resouce.setMethod(null);

        // Create the Resouce, which fails.

        restResouceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(resouce)))
            .andExpect(status().isBadRequest());

        List<Resouce> resouceList = resouceRepository.findAll();
        assertThat(resouceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllResouces() throws Exception {
        // Initialize the database
        resouceRepository.saveAndFlush(resouce);

        // Get all the resouceList
        restResouceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(resouce.getId().intValue())))
            .andExpect(jsonPath("$.[*].address").value(hasItem(DEFAULT_ADDRESS)))
            .andExpect(jsonPath("$.[*].method").value(hasItem(DEFAULT_METHOD)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllResoucesWithEagerRelationshipsIsEnabled() throws Exception {
        when(resouceRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restResouceMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(resouceRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllResoucesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(resouceRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restResouceMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(resouceRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getResouce() throws Exception {
        // Initialize the database
        resouceRepository.saveAndFlush(resouce);

        // Get the resouce
        restResouceMockMvc
            .perform(get(ENTITY_API_URL_ID, resouce.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(resouce.getId().intValue()))
            .andExpect(jsonPath("$.address").value(DEFAULT_ADDRESS))
            .andExpect(jsonPath("$.method").value(DEFAULT_METHOD))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingResouce() throws Exception {
        // Get the resouce
        restResouceMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewResouce() throws Exception {
        // Initialize the database
        resouceRepository.saveAndFlush(resouce);

        int databaseSizeBeforeUpdate = resouceRepository.findAll().size();

        // Update the resouce
        Resouce updatedResouce = resouceRepository.findById(resouce.getId()).get();
        // Disconnect from session so that the updates on updatedResouce are not directly saved in db
        em.detach(updatedResouce);
        updatedResouce.address(UPDATED_ADDRESS).method(UPDATED_METHOD).description(UPDATED_DESCRIPTION);

        restResouceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedResouce.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedResouce))
            )
            .andExpect(status().isOk());

        // Validate the Resouce in the database
        List<Resouce> resouceList = resouceRepository.findAll();
        assertThat(resouceList).hasSize(databaseSizeBeforeUpdate);
        Resouce testResouce = resouceList.get(resouceList.size() - 1);
        assertThat(testResouce.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testResouce.getMethod()).isEqualTo(UPDATED_METHOD);
        assertThat(testResouce.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingResouce() throws Exception {
        int databaseSizeBeforeUpdate = resouceRepository.findAll().size();
        resouce.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restResouceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, resouce.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(resouce))
            )
            .andExpect(status().isBadRequest());

        // Validate the Resouce in the database
        List<Resouce> resouceList = resouceRepository.findAll();
        assertThat(resouceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchResouce() throws Exception {
        int databaseSizeBeforeUpdate = resouceRepository.findAll().size();
        resouce.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restResouceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(resouce))
            )
            .andExpect(status().isBadRequest());

        // Validate the Resouce in the database
        List<Resouce> resouceList = resouceRepository.findAll();
        assertThat(resouceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamResouce() throws Exception {
        int databaseSizeBeforeUpdate = resouceRepository.findAll().size();
        resouce.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restResouceMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(resouce)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Resouce in the database
        List<Resouce> resouceList = resouceRepository.findAll();
        assertThat(resouceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateResouceWithPatch() throws Exception {
        // Initialize the database
        resouceRepository.saveAndFlush(resouce);

        int databaseSizeBeforeUpdate = resouceRepository.findAll().size();

        // Update the resouce using partial update
        Resouce partialUpdatedResouce = new Resouce();
        partialUpdatedResouce.setId(resouce.getId());

        partialUpdatedResouce.description(UPDATED_DESCRIPTION);

        restResouceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedResouce.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedResouce))
            )
            .andExpect(status().isOk());

        // Validate the Resouce in the database
        List<Resouce> resouceList = resouceRepository.findAll();
        assertThat(resouceList).hasSize(databaseSizeBeforeUpdate);
        Resouce testResouce = resouceList.get(resouceList.size() - 1);
        assertThat(testResouce.getAddress()).isEqualTo(DEFAULT_ADDRESS);
        assertThat(testResouce.getMethod()).isEqualTo(DEFAULT_METHOD);
        assertThat(testResouce.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateResouceWithPatch() throws Exception {
        // Initialize the database
        resouceRepository.saveAndFlush(resouce);

        int databaseSizeBeforeUpdate = resouceRepository.findAll().size();

        // Update the resouce using partial update
        Resouce partialUpdatedResouce = new Resouce();
        partialUpdatedResouce.setId(resouce.getId());

        partialUpdatedResouce.address(UPDATED_ADDRESS).method(UPDATED_METHOD).description(UPDATED_DESCRIPTION);

        restResouceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedResouce.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedResouce))
            )
            .andExpect(status().isOk());

        // Validate the Resouce in the database
        List<Resouce> resouceList = resouceRepository.findAll();
        assertThat(resouceList).hasSize(databaseSizeBeforeUpdate);
        Resouce testResouce = resouceList.get(resouceList.size() - 1);
        assertThat(testResouce.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testResouce.getMethod()).isEqualTo(UPDATED_METHOD);
        assertThat(testResouce.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingResouce() throws Exception {
        int databaseSizeBeforeUpdate = resouceRepository.findAll().size();
        resouce.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restResouceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, resouce.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(resouce))
            )
            .andExpect(status().isBadRequest());

        // Validate the Resouce in the database
        List<Resouce> resouceList = resouceRepository.findAll();
        assertThat(resouceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchResouce() throws Exception {
        int databaseSizeBeforeUpdate = resouceRepository.findAll().size();
        resouce.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restResouceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(resouce))
            )
            .andExpect(status().isBadRequest());

        // Validate the Resouce in the database
        List<Resouce> resouceList = resouceRepository.findAll();
        assertThat(resouceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamResouce() throws Exception {
        int databaseSizeBeforeUpdate = resouceRepository.findAll().size();
        resouce.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restResouceMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(resouce)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Resouce in the database
        List<Resouce> resouceList = resouceRepository.findAll();
        assertThat(resouceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteResouce() throws Exception {
        // Initialize the database
        resouceRepository.saveAndFlush(resouce);

        int databaseSizeBeforeDelete = resouceRepository.findAll().size();

        // Delete the resouce
        restResouceMockMvc
            .perform(delete(ENTITY_API_URL_ID, resouce.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Resouce> resouceList = resouceRepository.findAll();
        assertThat(resouceList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
