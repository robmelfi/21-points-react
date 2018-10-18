package com.robmelfi.health.web.rest;

import com.robmelfi.health.TwentyOnePointsReactApp;

import com.robmelfi.health.domain.Preferences;
import com.robmelfi.health.domain.User;
import com.robmelfi.health.repository.PreferencesRepository;
import com.robmelfi.health.repository.UserRepository;
import com.robmelfi.health.repository.search.PreferencesSearchRepository;
import com.robmelfi.health.service.PreferencesService;
import com.robmelfi.health.service.dto.PreferencesDTO;
import com.robmelfi.health.service.mapper.PreferencesMapper;
import com.robmelfi.health.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.Collections;
import java.util.List;


import static com.robmelfi.health.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.robmelfi.health.domain.enumeration.Units;
import org.springframework.web.context.WebApplicationContext;

/**
 * Test class for the PreferencesResource REST controller.
 *
 * @see PreferencesResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = TwentyOnePointsReactApp.class)
public class PreferencesResourceIntTest {

    private static final Integer DEFAULT_WEEKLY_GOAL = 10;
    private static final Integer UPDATED_WEEKLY_GOAL = 11;

    private static final Units DEFAULT_WEIGHT_UNITS = Units.KG;
    private static final Units UPDATED_WEIGHT_UNITS = Units.LB;

    @Autowired
    private PreferencesRepository preferencesRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PreferencesMapper preferencesMapper;
    
    @Autowired
    private PreferencesService preferencesService;

    @Autowired
    private WebApplicationContext context;

    /**
     * This repository is mocked in the com.robmelfi.health.repository.search test package.
     *
     * @see com.robmelfi.health.repository.search.PreferencesSearchRepositoryMockConfiguration
     */
    @Autowired
    private PreferencesSearchRepository mockPreferencesSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restPreferencesMockMvc;

    private Preferences preferences;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final PreferencesResource preferencesResource = new PreferencesResource(preferencesService);
        this.restPreferencesMockMvc = MockMvcBuilders.standaloneSetup(preferencesResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Preferences createEntity(EntityManager em) {
        Preferences preferences = new Preferences()
            .weeklyGoal(DEFAULT_WEEKLY_GOAL)
            .weightUnits(DEFAULT_WEIGHT_UNITS);
        return preferences;
    }

    @Before
    public void initTest() {
        preferences = createEntity(em);
    }

    @Test
    @Transactional
    public void createPreferences() throws Exception {
        int databaseSizeBeforeCreate = preferencesRepository.findAll().size();

        // Create the Preferences
        PreferencesDTO preferencesDTO = preferencesMapper.toDto(preferences);
        restPreferencesMockMvc.perform(post("/api/preferences")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(preferencesDTO)))
            .andExpect(status().isCreated());

        // Validate the Preferences in the database
        List<Preferences> preferencesList = preferencesRepository.findAll();
        assertThat(preferencesList).hasSize(databaseSizeBeforeCreate + 1);
        Preferences testPreferences = preferencesList.get(preferencesList.size() - 1);
        assertThat(testPreferences.getWeeklyGoal()).isEqualTo(DEFAULT_WEEKLY_GOAL);
        assertThat(testPreferences.getWeightUnits()).isEqualTo(DEFAULT_WEIGHT_UNITS);

        // Validate the Preferences in Elasticsearch
        verify(mockPreferencesSearchRepository, times(1)).save(testPreferences);
    }

    @Test
    @Transactional
    public void createPreferencesWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = preferencesRepository.findAll().size();

        // Create the Preferences with an existing ID
        preferences.setId(1L);
        PreferencesDTO preferencesDTO = preferencesMapper.toDto(preferences);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPreferencesMockMvc.perform(post("/api/preferences")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(preferencesDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Preferences in the database
        List<Preferences> preferencesList = preferencesRepository.findAll();
        assertThat(preferencesList).hasSize(databaseSizeBeforeCreate);

        // Validate the Preferences in Elasticsearch
        verify(mockPreferencesSearchRepository, times(0)).save(preferences);
    }

    @Test
    @Transactional
    public void checkWeeklyGoalIsRequired() throws Exception {
        int databaseSizeBeforeTest = preferencesRepository.findAll().size();
        // set the field null
        preferences.setWeeklyGoal(null);

        // Create the Preferences, which fails.
        PreferencesDTO preferencesDTO = preferencesMapper.toDto(preferences);

        restPreferencesMockMvc.perform(post("/api/preferences")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(preferencesDTO)))
            .andExpect(status().isBadRequest());

        List<Preferences> preferencesList = preferencesRepository.findAll();
        assertThat(preferencesList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkWeightUnitsIsRequired() throws Exception {
        int databaseSizeBeforeTest = preferencesRepository.findAll().size();
        // set the field null
        preferences.setWeightUnits(null);

        // Create the Preferences, which fails.
        PreferencesDTO preferencesDTO = preferencesMapper.toDto(preferences);

        restPreferencesMockMvc.perform(post("/api/preferences")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(preferencesDTO)))
            .andExpect(status().isBadRequest());

        List<Preferences> preferencesList = preferencesRepository.findAll();
        assertThat(preferencesList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllPreferences() throws Exception {
        // Initialize the database
        preferencesRepository.saveAndFlush(preferences);

        // create security-aware mockMvc
        restPreferencesMockMvc = MockMvcBuilders
            .webAppContextSetup(context)
            .apply(springSecurity())
            .build();

        // Get all the preferencesList
        restPreferencesMockMvc.perform(get("/api/preferences?sort=id,desc")
            .with(user("admin").roles("ADMIN")))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(preferences.getId().intValue())))
            .andExpect(jsonPath("$.[*].weeklyGoal").value(hasItem(DEFAULT_WEEKLY_GOAL)))
            .andExpect(jsonPath("$.[*].weightUnits").value(hasItem(DEFAULT_WEIGHT_UNITS.toString())));
    }
    
    @Test
    @Transactional
    public void getPreferences() throws Exception {
        // Initialize the database
        preferencesRepository.saveAndFlush(preferences);

        // Get the preferences
        restPreferencesMockMvc.perform(get("/api/preferences/{id}", preferences.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(preferences.getId().intValue()))
            .andExpect(jsonPath("$.weeklyGoal").value(DEFAULT_WEEKLY_GOAL))
            .andExpect(jsonPath("$.weightUnits").value(DEFAULT_WEIGHT_UNITS.toString()));
    }

    private void createUserPreferences() {
        User user = userRepository.findOneByLogin("user").get();
        // Create preferences
        Preferences preferences = new Preferences().weeklyGoal(15).weightUnits(Units.KG).user(user);
        preferencesRepository.saveAndFlush(preferences);
    }

    @Test
    @Transactional
    public void getUserPreferences() throws Exception {

        createUserPreferences();

        // Create security-aware mockMvc
        restPreferencesMockMvc = MockMvcBuilders
            .webAppContextSetup(context)
            .apply(springSecurity())
            .build();

        // Get the preferences
        restPreferencesMockMvc.perform(get("/api/my-preferences")
            .with(user("user").roles("USER")))
            .andExpect(status().isOk())
            .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.weeklyGoal").value(15));
    }

    @Test
    @Transactional
    public void getDefaultUserPreferences() throws Exception {

        // Create security-aware mockMvc
        restPreferencesMockMvc = MockMvcBuilders
            .webAppContextSetup(context)
            .apply(springSecurity())
            .build();

        // Get the preferences
        restPreferencesMockMvc.perform(get("/api/my-preferences")
            .with(user("user").roles("USER")))
            .andExpect(status().isOk())
            .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.weeklyGoal").value(10));
    }

    @Test
    @Transactional
    public void getNonExistingPreferences() throws Exception {
        // Get the preferences
        restPreferencesMockMvc.perform(get("/api/preferences/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePreferences() throws Exception {
        // Initialize the database
        preferencesRepository.saveAndFlush(preferences);

        int databaseSizeBeforeUpdate = preferencesRepository.findAll().size();

        // Update the preferences
        Preferences updatedPreferences = preferencesRepository.findById(preferences.getId()).get();
        // Disconnect from session so that the updates on updatedPreferences are not directly saved in db
        em.detach(updatedPreferences);
        updatedPreferences
            .weeklyGoal(UPDATED_WEEKLY_GOAL)
            .weightUnits(UPDATED_WEIGHT_UNITS);
        PreferencesDTO preferencesDTO = preferencesMapper.toDto(updatedPreferences);

        restPreferencesMockMvc.perform(put("/api/preferences")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(preferencesDTO)))
            .andExpect(status().isOk());

        // Validate the Preferences in the database
        List<Preferences> preferencesList = preferencesRepository.findAll();
        assertThat(preferencesList).hasSize(databaseSizeBeforeUpdate);
        Preferences testPreferences = preferencesList.get(preferencesList.size() - 1);
        assertThat(testPreferences.getWeeklyGoal()).isEqualTo(UPDATED_WEEKLY_GOAL);
        assertThat(testPreferences.getWeightUnits()).isEqualTo(UPDATED_WEIGHT_UNITS);

        // Validate the Preferences in Elasticsearch
        verify(mockPreferencesSearchRepository, times(1)).save(testPreferences);
    }

    @Test
    @Transactional
    public void updateNonExistingPreferences() throws Exception {
        int databaseSizeBeforeUpdate = preferencesRepository.findAll().size();

        // Create the Preferences
        PreferencesDTO preferencesDTO = preferencesMapper.toDto(preferences);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPreferencesMockMvc.perform(put("/api/preferences")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(preferencesDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Preferences in the database
        List<Preferences> preferencesList = preferencesRepository.findAll();
        assertThat(preferencesList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Preferences in Elasticsearch
        verify(mockPreferencesSearchRepository, times(0)).save(preferences);
    }

    @Test
    @Transactional
    public void deletePreferences() throws Exception {
        // Initialize the database
        preferencesRepository.saveAndFlush(preferences);

        int databaseSizeBeforeDelete = preferencesRepository.findAll().size();

        // Get the preferences
        restPreferencesMockMvc.perform(delete("/api/preferences/{id}", preferences.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Preferences> preferencesList = preferencesRepository.findAll();
        assertThat(preferencesList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Preferences in Elasticsearch
        verify(mockPreferencesSearchRepository, times(1)).deleteById(preferences.getId());
    }

    @Test
    @Transactional
    public void searchPreferences() throws Exception {
        // Initialize the database
        preferencesRepository.saveAndFlush(preferences);
        when(mockPreferencesSearchRepository.search(queryStringQuery("id:" + preferences.getId())))
            .thenReturn(Collections.singletonList(preferences));
        // Search the preferences
        restPreferencesMockMvc.perform(get("/api/_search/preferences?query=id:" + preferences.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(preferences.getId().intValue())))
            .andExpect(jsonPath("$.[*].weeklyGoal").value(hasItem(DEFAULT_WEEKLY_GOAL)))
            .andExpect(jsonPath("$.[*].weightUnits").value(hasItem(DEFAULT_WEIGHT_UNITS.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Preferences.class);
        Preferences preferences1 = new Preferences();
        preferences1.setId(1L);
        Preferences preferences2 = new Preferences();
        preferences2.setId(preferences1.getId());
        assertThat(preferences1).isEqualTo(preferences2);
        preferences2.setId(2L);
        assertThat(preferences1).isNotEqualTo(preferences2);
        preferences1.setId(null);
        assertThat(preferences1).isNotEqualTo(preferences2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(PreferencesDTO.class);
        PreferencesDTO preferencesDTO1 = new PreferencesDTO();
        preferencesDTO1.setId(1L);
        PreferencesDTO preferencesDTO2 = new PreferencesDTO();
        assertThat(preferencesDTO1).isNotEqualTo(preferencesDTO2);
        preferencesDTO2.setId(preferencesDTO1.getId());
        assertThat(preferencesDTO1).isEqualTo(preferencesDTO2);
        preferencesDTO2.setId(2L);
        assertThat(preferencesDTO1).isNotEqualTo(preferencesDTO2);
        preferencesDTO1.setId(null);
        assertThat(preferencesDTO1).isNotEqualTo(preferencesDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(preferencesMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(preferencesMapper.fromId(null)).isNull();
    }
}
