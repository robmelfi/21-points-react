package com.robmelfi.health.service;

import com.robmelfi.health.domain.Preferences;
import com.robmelfi.health.repository.PreferencesRepository;
import com.robmelfi.health.repository.UserRepository;
import com.robmelfi.health.repository.search.PreferencesSearchRepository;
import com.robmelfi.health.security.AuthoritiesConstants;
import com.robmelfi.health.security.SecurityUtils;
import com.robmelfi.health.service.dto.PreferencesDTO;
import com.robmelfi.health.domain.User;
import com.robmelfi.health.service.mapper.PreferencesMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing Preferences.
 */
@Service
@Transactional
public class PreferencesService {

    private final Logger log = LoggerFactory.getLogger(PreferencesService.class);

    private final PreferencesRepository preferencesRepository;

    private final PreferencesMapper preferencesMapper;

    private final PreferencesSearchRepository preferencesSearchRepository;

    private final UserRepository userRepository;

    public PreferencesService(PreferencesRepository preferencesRepository, PreferencesMapper preferencesMapper, PreferencesSearchRepository preferencesSearchRepository, UserRepository userRepository) {
        this.preferencesRepository = preferencesRepository;
        this.preferencesMapper = preferencesMapper;
        this.preferencesSearchRepository = preferencesSearchRepository;
        this.userRepository = userRepository;
    }

    /**
     * Save a preferences.
     *
     * @param preferencesDTO the entity to save
     * @return the persisted entity
     */
    public PreferencesDTO save(PreferencesDTO preferencesDTO) {
        log.debug("Request to save Preferences : {}", preferencesDTO);

        Preferences preferences = preferencesMapper.toEntity(preferencesDTO);
        User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin().orElse(null)).orElse(null);
        preferences.setUser(user);
        preferences = preferencesRepository.save(preferences);
        PreferencesDTO result = preferencesMapper.toDto(preferences);
        preferencesSearchRepository.save(preferences);
        return result;
    }

    /**
     * Get all the preferences.
     *
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public List<PreferencesDTO> findAll() {
        log.debug("Request to get all Preferences");
        List<PreferencesDTO> preferencesDTO = new ArrayList<>();
        if (SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)) {
            preferencesDTO = preferencesRepository.findAll().stream()
                .map(preferencesMapper::toDto)
                .collect(Collectors.toCollection(LinkedList::new));
        } else {
            PreferencesDTO userPreferencesDTO = getUserPreferences();
            // don't return default value of 10 points in this method
            if (userPreferencesDTO.getId() != null) {
                preferencesDTO.add(userPreferencesDTO);
            }
        }
        return preferencesDTO;
    }


    /**
     * Get one preferences by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public Optional<PreferencesDTO> findOne(Long id) {
        log.debug("Request to get Preferences : {}", id);
        return preferencesRepository.findById(id)
            .map(preferencesMapper::toDto);
    }

    /**
     * Get user preferences.
     *
     * @return the user preferences
     */
    @Transactional(readOnly = true)
    public PreferencesDTO getUserPreferences() {
        String username = SecurityUtils.getCurrentUserLogin().get();
        log.debug("Request to get User Preferences : {}", username);
        Optional<Preferences> preferences = preferencesRepository.findOneByUserLogin(username);

        if (preferences.isPresent()) {
            return preferences.map(preferencesMapper::toDto).get();
        } else {
            PreferencesDTO defaultPreferences = new PreferencesDTO();
            defaultPreferences.setWeeklyGoal(10); // default
            return defaultPreferences;
        }
    }

    /**
     * Delete the preferences by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete Preferences : {}", id);
        preferencesRepository.deleteById(id);
        preferencesSearchRepository.deleteById(id);
    }

    /**
     * Search for the preferences corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public List<PreferencesDTO> search(String query) {
        log.debug("Request to search Preferences for query {}", query);
        return StreamSupport
            .stream(preferencesSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .map(preferencesMapper::toDto)
            .collect(Collectors.toList());
    }
}
