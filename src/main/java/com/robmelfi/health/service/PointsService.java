package com.robmelfi.health.service;

import com.robmelfi.health.domain.Points;
import com.robmelfi.health.repository.PointsRepository;
import com.robmelfi.health.repository.search.PointsSearchRepository;
import com.robmelfi.health.service.dto.PointsDTO;
import com.robmelfi.health.service.mapper.PointsMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing Points.
 */
@Service
@Transactional
public class PointsService {

    private final Logger log = LoggerFactory.getLogger(PointsService.class);

    private final PointsRepository pointsRepository;

    private final PointsMapper pointsMapper;

    private final PointsSearchRepository pointsSearchRepository;

    public PointsService(PointsRepository pointsRepository, PointsMapper pointsMapper, PointsSearchRepository pointsSearchRepository) {
        this.pointsRepository = pointsRepository;
        this.pointsMapper = pointsMapper;
        this.pointsSearchRepository = pointsSearchRepository;
    }

    /**
     * Save a points.
     *
     * @param pointsDTO the entity to save
     * @return the persisted entity
     */
    public PointsDTO save(PointsDTO pointsDTO) {
        log.debug("Request to save Points : {}", pointsDTO);

        Points points = pointsMapper.toEntity(pointsDTO);
        points = pointsRepository.save(points);
        PointsDTO result = pointsMapper.toDto(points);
        pointsSearchRepository.save(points);
        return result;
    }

    /**
     * Get all the points.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<PointsDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Points");
        return pointsRepository.findAll(pageable)
            .map(pointsMapper::toDto);
    }


    /**
     * Get one points by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public Optional<PointsDTO> findOne(Long id) {
        log.debug("Request to get Points : {}", id);
        return pointsRepository.findById(id)
            .map(pointsMapper::toDto);
    }

    /**
     * Delete the points by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete Points : {}", id);
        pointsRepository.deleteById(id);
        pointsSearchRepository.deleteById(id);
    }

    /**
     * Search for the points corresponding to the query.
     *
     * @param query the query of the search
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<PointsDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Points for query {}", query);
        return pointsSearchRepository.search(queryStringQuery(query), pageable)
            .map(pointsMapper::toDto);
    }
}
