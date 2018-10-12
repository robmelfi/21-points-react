package com.robmelfi.health.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.robmelfi.health.service.WeigthService;
import com.robmelfi.health.web.rest.errors.BadRequestAlertException;
import com.robmelfi.health.web.rest.util.HeaderUtil;
import com.robmelfi.health.web.rest.util.PaginationUtil;
import com.robmelfi.health.service.dto.WeigthDTO;
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
 * REST controller for managing Weigth.
 */
@RestController
@RequestMapping("/api")
public class WeigthResource {

    private final Logger log = LoggerFactory.getLogger(WeigthResource.class);

    private static final String ENTITY_NAME = "weigth";

    private final WeigthService weigthService;

    public WeigthResource(WeigthService weigthService) {
        this.weigthService = weigthService;
    }

    /**
     * POST  /weigths : Create a new weigth.
     *
     * @param weigthDTO the weigthDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new weigthDTO, or with status 400 (Bad Request) if the weigth has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/weigths")
    @Timed
    public ResponseEntity<WeigthDTO> createWeigth(@Valid @RequestBody WeigthDTO weigthDTO) throws URISyntaxException {
        log.debug("REST request to save Weigth : {}", weigthDTO);
        if (weigthDTO.getId() != null) {
            throw new BadRequestAlertException("A new weigth cannot already have an ID", ENTITY_NAME, "idexists");
        }
        WeigthDTO result = weigthService.save(weigthDTO);
        return ResponseEntity.created(new URI("/api/weigths/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /weigths : Updates an existing weigth.
     *
     * @param weigthDTO the weigthDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated weigthDTO,
     * or with status 400 (Bad Request) if the weigthDTO is not valid,
     * or with status 500 (Internal Server Error) if the weigthDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/weigths")
    @Timed
    public ResponseEntity<WeigthDTO> updateWeigth(@Valid @RequestBody WeigthDTO weigthDTO) throws URISyntaxException {
        log.debug("REST request to update Weigth : {}", weigthDTO);
        if (weigthDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        WeigthDTO result = weigthService.save(weigthDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, weigthDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /weigths : get all the weigths.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of weigths in body
     */
    @GetMapping("/weigths")
    @Timed
    public ResponseEntity<List<WeigthDTO>> getAllWeigths(Pageable pageable) {
        log.debug("REST request to get a page of Weigths");
        Page<WeigthDTO> page = weigthService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/weigths");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /weigths/:id : get the "id" weigth.
     *
     * @param id the id of the weigthDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the weigthDTO, or with status 404 (Not Found)
     */
    @GetMapping("/weigths/{id}")
    @Timed
    public ResponseEntity<WeigthDTO> getWeigth(@PathVariable Long id) {
        log.debug("REST request to get Weigth : {}", id);
        Optional<WeigthDTO> weigthDTO = weigthService.findOne(id);
        return ResponseUtil.wrapOrNotFound(weigthDTO);
    }

    /**
     * DELETE  /weigths/:id : delete the "id" weigth.
     *
     * @param id the id of the weigthDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/weigths/{id}")
    @Timed
    public ResponseEntity<Void> deleteWeigth(@PathVariable Long id) {
        log.debug("REST request to delete Weigth : {}", id);
        weigthService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/weigths?query=:query : search for the weigth corresponding
     * to the query.
     *
     * @param query the query of the weigth search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/weigths")
    @Timed
    public ResponseEntity<List<WeigthDTO>> searchWeigths(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Weigths for query {}", query);
        Page<WeigthDTO> page = weigthService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/weigths");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
