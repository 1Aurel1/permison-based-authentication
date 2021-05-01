package com.obai.auth.web.rest;

import com.obai.auth.domain.Resouce;
import com.obai.auth.repository.ResouceRepository;
import com.obai.auth.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.obai.auth.domain.Resouce}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ResouceResource {

    private final Logger log = LoggerFactory.getLogger(ResouceResource.class);

    private static final String ENTITY_NAME = "resouce";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ResouceRepository resouceRepository;

    public ResouceResource(ResouceRepository resouceRepository) {
        this.resouceRepository = resouceRepository;
    }

    /**
     * {@code POST  /resouces} : Create a new resouce.
     *
     * @param resouce the resouce to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new resouce, or with status {@code 400 (Bad Request)} if the resouce has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/resouces")
    public ResponseEntity<Resouce> createResouce(@Valid @RequestBody Resouce resouce) throws URISyntaxException {
        log.debug("REST request to save Resouce : {}", resouce);
        if (resouce.getId() != null) {
            throw new BadRequestAlertException("A new resouce cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Resouce result = resouceRepository.save(resouce);
        return ResponseEntity
            .created(new URI("/api/resouces/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /resouces/:id} : Updates an existing resouce.
     *
     * @param id the id of the resouce to save.
     * @param resouce the resouce to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated resouce,
     * or with status {@code 400 (Bad Request)} if the resouce is not valid,
     * or with status {@code 500 (Internal Server Error)} if the resouce couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/resouces/{id}")
    public ResponseEntity<Resouce> updateResouce(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Resouce resouce
    ) throws URISyntaxException {
        log.debug("REST request to update Resouce : {}, {}", id, resouce);
        if (resouce.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, resouce.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!resouceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Resouce result = resouceRepository.save(resouce);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, resouce.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /resouces/:id} : Partial updates given fields of an existing resouce, field will ignore if it is null
     *
     * @param id the id of the resouce to save.
     * @param resouce the resouce to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated resouce,
     * or with status {@code 400 (Bad Request)} if the resouce is not valid,
     * or with status {@code 404 (Not Found)} if the resouce is not found,
     * or with status {@code 500 (Internal Server Error)} if the resouce couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/resouces/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Resouce> partialUpdateResouce(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Resouce resouce
    ) throws URISyntaxException {
        log.debug("REST request to partial update Resouce partially : {}, {}", id, resouce);
        if (resouce.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, resouce.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!resouceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Resouce> result = resouceRepository
            .findById(resouce.getId())
            .map(
                existingResouce -> {
                    if (resouce.getAddress() != null) {
                        existingResouce.setAddress(resouce.getAddress());
                    }
                    if (resouce.getMethod() != null) {
                        existingResouce.setMethod(resouce.getMethod());
                    }
                    if (resouce.getDescription() != null) {
                        existingResouce.setDescription(resouce.getDescription());
                    }

                    return existingResouce;
                }
            )
            .map(resouceRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, resouce.getId().toString())
        );
    }

    /**
     * {@code GET  /resouces} : get all the resouces.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of resouces in body.
     */
    @GetMapping("/resouces")
    public List<Resouce> getAllResouces(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Resouces");
        return resouceRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /resouces/:id} : get the "id" resouce.
     *
     * @param id the id of the resouce to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the resouce, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/resouces/{id}")
    public ResponseEntity<Resouce> getResouce(@PathVariable Long id) {
        log.debug("REST request to get Resouce : {}", id);
        Optional<Resouce> resouce = resouceRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(resouce);
    }

    /**
     * {@code DELETE  /resouces/:id} : delete the "id" resouce.
     *
     * @param id the id of the resouce to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/resouces/{id}")
    public ResponseEntity<Void> deleteResouce(@PathVariable Long id) {
        log.debug("REST request to delete Resouce : {}", id);
        resouceRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
