package com.robmelfi.health.service;

import com.robmelfi.health.domain.Weigth;
import com.robmelfi.health.repository.WeigthRepository;
import com.robmelfi.health.repository.search.WeigthSearchRepository;
import com.robmelfi.health.service.dto.WeigthDTO;
import com.robmelfi.health.service.mapper.WeigthMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing Weigth.
 */
@Service
@Transactional
public class WeigthService {

    private final Logger log = LoggerFactory.getLogger(WeigthService.class);

    private final WeigthRepository weigthRepository;

    private final WeigthMapper weigthMapper;

    private final WeigthSearchRepository weigthSearchRepository;

    public WeigthService(WeigthRepository weigthRepository, WeigthMapper weigthMapper, WeigthSearchRepository weigthSearchRepository) {
        this.weigthRepository = weigthRepository;
        this.weigthMapper = weigthMapper;
        this.weigthSearchRepository = weigthSearchRepository;
    }

    /**
     * Save a weigth.
     *
     * @param weigthDTO the entity to save
     * @return the persisted entity
     */
    public WeigthDTO save(WeigthDTO weigthDTO) {
        log.debug("Request to save Weigth : {}", weigthDTO);

        Weigth weigth = weigthMapper.toEntity(weigthDTO);
        weigth = weigthRepository.save(weigth);
        WeigthDTO result = weigthMapper.toDto(weigth);
        weigthSearchRepository.save(weigth);
        return result;
    }

    /**
     * Get all the weigths.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<WeigthDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Weigths");
        return weigthRepository.findAll(pageable)
            .map(weigthMapper::toDto);
    }


    /**
     * Get one weigth by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public Optional<WeigthDTO> findOne(Long id) {
        log.debug("Request to get Weigth : {}", id);
        return weigthRepository.findById(id)
            .map(weigthMapper::toDto);
    }

    /**
     * Delete the weigth by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete Weigth : {}", id);
        weigthRepository.deleteById(id);
        weigthSearchRepository.deleteById(id);
    }

    /**
     * Search for the weigth corresponding to the query.
     *
     * @param query the query of the search
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<WeigthDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Weigths for query {}", query);
        return weigthSearchRepository.search(queryStringQuery(query), pageable)
            .map(weigthMapper::toDto);
    }
}
