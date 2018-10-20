package com.robmelfi.health.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.robmelfi.health.service.BloodPressureService;
import com.robmelfi.health.service.dto.BloodPressureByPeriodDTO;
import com.robmelfi.health.web.rest.errors.BadRequestAlertException;
import com.robmelfi.health.web.rest.util.HeaderUtil;
import com.robmelfi.health.web.rest.util.PaginationUtil;
import com.robmelfi.health.service.dto.BloodPressureDTO;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing BloodPressure.
 */
@RestController
@RequestMapping("/api")
public class BloodPressureResource {

    private final Logger log = LoggerFactory.getLogger(BloodPressureResource.class);

    private static final String ENTITY_NAME = "bloodPressure";

    private final BloodPressureService bloodPressureService;

    public BloodPressureResource(BloodPressureService bloodPressureService) {
        this.bloodPressureService = bloodPressureService;
    }

    /**
     * POST  /blood-pressures : Create a new bloodPressure.
     *
     * @param bloodPressureDTO the bloodPressureDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new bloodPressureDTO, or with status 400 (Bad Request) if the bloodPressure has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/blood-pressures")
    @Timed
    public ResponseEntity<BloodPressureDTO> createBloodPressure(@Valid @RequestBody BloodPressureDTO bloodPressureDTO) throws URISyntaxException {
        log.debug("REST request to save BloodPressure : {}", bloodPressureDTO);
        if (bloodPressureDTO.getId() != null) {
            throw new BadRequestAlertException("A new bloodPressure cannot already have an ID", ENTITY_NAME, "idexists");
        }
        BloodPressureDTO result = bloodPressureService.save(bloodPressureDTO);
        return ResponseEntity.created(new URI("/api/blood-pressures/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /blood-pressures : Updates an existing bloodPressure.
     *
     * @param bloodPressureDTO the bloodPressureDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated bloodPressureDTO,
     * or with status 400 (Bad Request) if the bloodPressureDTO is not valid,
     * or with status 500 (Internal Server Error) if the bloodPressureDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/blood-pressures")
    @Timed
    public ResponseEntity<BloodPressureDTO> updateBloodPressure(@Valid @RequestBody BloodPressureDTO bloodPressureDTO) throws URISyntaxException {
        log.debug("REST request to update BloodPressure : {}", bloodPressureDTO);
        if (bloodPressureDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        BloodPressureDTO result = bloodPressureService.save(bloodPressureDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, bloodPressureDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /blood-pressures : get all the bloodPressures.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of bloodPressures in body
     */
    @GetMapping("/blood-pressures")
    @Timed
    public ResponseEntity<List<BloodPressureDTO>> getAllBloodPressures(Pageable pageable) {
        log.debug("REST request to get a page of BloodPressures");
        Page<BloodPressureDTO> page = bloodPressureService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/blood-pressures");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    @GetMapping("/bp-by-days/{days}")
    @Timed
    public ResponseEntity<BloodPressureByPeriodDTO> getByDays(@PathVariable int days) {
        log.debug("REST request to get BloodPressures by Days");
        BloodPressureByPeriodDTO response = bloodPressureService.getByDays(days);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * GET  /blood-pressures/:id : get the "id" bloodPressure.
     *
     * @param id the id of the bloodPressureDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the bloodPressureDTO, or with status 404 (Not Found)
     */
    @GetMapping("/blood-pressures/{id}")
    @Timed
    public ResponseEntity<BloodPressureDTO> getBloodPressure(@PathVariable Long id) {
        log.debug("REST request to get BloodPressure : {}", id);
        Optional<BloodPressureDTO> bloodPressureDTO = bloodPressureService.findOne(id);
        return ResponseUtil.wrapOrNotFound(bloodPressureDTO);
    }

    /**
     * DELETE  /blood-pressures/:id : delete the "id" bloodPressure.
     *
     * @param id the id of the bloodPressureDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/blood-pressures/{id}")
    @Timed
    public ResponseEntity<Void> deleteBloodPressure(@PathVariable Long id) {
        log.debug("REST request to delete BloodPressure : {}", id);
        bloodPressureService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/blood-pressures?query=:query : search for the bloodPressure corresponding
     * to the query.
     *
     * @param query the query of the bloodPressure search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/blood-pressures")
    @Timed
    public ResponseEntity<List<BloodPressureDTO>> searchBloodPressures(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of BloodPressures for query {}", query);
        Page<BloodPressureDTO> page = bloodPressureService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/blood-pressures");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
