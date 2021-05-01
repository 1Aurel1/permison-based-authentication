package com.obai.auth.web.rest;

import com.obai.auth.domain.Permision;
import com.obai.auth.repository.PermisionRepository;
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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.obai.auth.domain.Permision}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PermisionResource {

    private final Logger log = LoggerFactory.getLogger(PermisionResource.class);

    private static final String ENTITY_NAME = "permision";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PermisionRepository permisionRepository;

    public PermisionResource(PermisionRepository permisionRepository) {
        this.permisionRepository = permisionRepository;
    }

    /**
     * {@code POST  /permisions} : Create a new permision.
     *
     * @param permision the permision to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new permision, or with status {@code 400 (Bad Request)} if the permision has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/permisions")
    public ResponseEntity<Permision> createPermision(@Valid @RequestBody Permision permision) throws URISyntaxException {
        log.debug("REST request to save Permision : {}", permision);
        if (permision.getId() != null) {
            throw new BadRequestAlertException("A new permision cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Permision result = permisionRepository.save(permision);
        return ResponseEntity
            .created(new URI("/api/permisions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /permisions/:id} : Updates an existing permision.
     *
     * @param id the id of the permision to save.
     * @param permision the permision to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated permision,
     * or with status {@code 400 (Bad Request)} if the permision is not valid,
     * or with status {@code 500 (Internal Server Error)} if the permision couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/permisions/{id}")
    public ResponseEntity<Permision> updatePermision(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Permision permision
    ) throws URISyntaxException {
        log.debug("REST request to update Permision : {}, {}", id, permision);
        if (permision.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, permision.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!permisionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Permision result = permisionRepository.save(permision);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, permision.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /permisions/:id} : Partial updates given fields of an existing permision, field will ignore if it is null
     *
     * @param id the id of the permision to save.
     * @param permision the permision to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated permision,
     * or with status {@code 400 (Bad Request)} if the permision is not valid,
     * or with status {@code 404 (Not Found)} if the permision is not found,
     * or with status {@code 500 (Internal Server Error)} if the permision couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/permisions/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Permision> partialUpdatePermision(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Permision permision
    ) throws URISyntaxException {
        log.debug("REST request to partial update Permision partially : {}, {}", id, permision);
        if (permision.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, permision.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!permisionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Permision> result = permisionRepository
            .findById(permision.getId())
            .map(
                existingPermision -> {
                    if (permision.getName() != null) {
                        existingPermision.setName(permision.getName());
                    }
                    if (permision.getDescription() != null) {
                        existingPermision.setDescription(permision.getDescription());
                    }

                    return existingPermision;
                }
            )
            .map(permisionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, permision.getId().toString())
        );
    }

    /**
     * {@code GET  /permisions} : get all the permisions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of permisions in body.
     */
    @GetMapping("/permisions")
    public List<Permision> getAllPermisions() {
        System.out.println(SecurityContextHolder.getContext().getAuthentication().getDetails());
        log.debug("REST request to get all Permisions");
        return permisionRepository.findAll();
    }

    /**
     * {@code GET  /permisions/:id} : get the "id" permision.
     *
     * @param id the id of the permision to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the permision, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/permisions/{id}")
    public ResponseEntity<Permision> getPermision(@PathVariable Long id) {
        log.debug("REST request to get Permision : {}", id);
        Optional<Permision> permision = permisionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(permision);
    }

    /**
     * {@code DELETE  /permisions/:id} : delete the "id" permision.
     *
     * @param id the id of the permision to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/permisions/{id}")
    public ResponseEntity<Void> deletePermision(@PathVariable Long id) {
        log.debug("REST request to delete Permision : {}", id);
        permisionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
