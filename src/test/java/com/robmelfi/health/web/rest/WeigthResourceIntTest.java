package com.robmelfi.health.web.rest;

import com.robmelfi.health.TwentyOnePointsReactApp;

import com.robmelfi.health.domain.Weigth;
import com.robmelfi.health.domain.User;
import com.robmelfi.health.repository.UserRepository;
import com.robmelfi.health.repository.WeigthRepository;
import com.robmelfi.health.repository.search.WeigthSearchRepository;
import com.robmelfi.health.service.WeigthService;
import com.robmelfi.health.service.dto.WeigthDTO;
import com.robmelfi.health.service.mapper.WeigthMapper;
import com.robmelfi.health.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.Collections;
import java.util.List;


import static com.robmelfi.health.web.rest.TestUtil.sameInstant;
import static com.robmelfi.health.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the WeigthResource REST controller.
 *
 * @see WeigthResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = TwentyOnePointsReactApp.class)
public class WeigthResourceIntTest {
    private final Logger log = LoggerFactory.getLogger(WeigthResourceIntTest.class);

    private static final ZonedDateTime DEFAULT_TIMESTAMP = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_TIMESTAMP = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Double DEFAULT_WEIGHT = 1D;
    private static final Double UPDATED_WEIGHT = 2D;

    @Autowired
    private WeigthRepository weigthRepository;

    @Autowired
    private WeigthMapper weigthMapper;
    
    @Autowired
    private WeigthService weigthService;

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private UserRepository userRepository;

    /**
     * This repository is mocked in the com.robmelfi.health.repository.search test package.
     *
     * @see com.robmelfi.health.repository.search.WeigthSearchRepositoryMockConfiguration
     */
    @Autowired
    private WeigthSearchRepository mockWeigthSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restWeigthMockMvc;

    private Weigth weigth;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final WeigthResource weigthResource = new WeigthResource(weigthService);
        this.restWeigthMockMvc = MockMvcBuilders.standaloneSetup(weigthResource)
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
    public static Weigth createEntity(EntityManager em) {
        Weigth weigth = new Weigth()
            .timestamp(DEFAULT_TIMESTAMP)
            .weight(DEFAULT_WEIGHT);
        // Add required entity
        User user = UserResourceIntTest.createEntity(em);
        em.persist(user);
        em.flush();
        weigth.setUser(user);
        return weigth;
    }

    @Before
    public void initTest() {
        weigth = createEntity(em);
    }

    @Test
    @Transactional
    public void createWeigth() throws Exception {
        int databaseSizeBeforeCreate = weigthRepository.findAll().size();

        // Create security-aware mockMvc
        restWeigthMockMvc = MockMvcBuilders
            .webAppContextSetup(context)
            .apply(springSecurity())
            .build();

        // Create the Weigth
        WeigthDTO weigthDTO = weigthMapper.toDto(weigth);
        restWeigthMockMvc.perform(post("/api/weigths")
            .with(user("user"))
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(weigthDTO)))
            .andExpect(status().isCreated());

        // Validate the Weigth in the database
        List<Weigth> weigthList = weigthRepository.findAll();
        assertThat(weigthList).hasSize(databaseSizeBeforeCreate + 1);
        Weigth testWeigth = weigthList.get(weigthList.size() - 1);
        assertThat(testWeigth.getTimestamp()).isEqualTo(DEFAULT_TIMESTAMP);
        assertThat(testWeigth.getWeight()).isEqualTo(DEFAULT_WEIGHT);

        // Validate the Weigth in Elasticsearch
        verify(mockWeigthSearchRepository, times(1)).save(testWeigth);
    }

    @Test
    @Transactional
    public void createWeigthWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = weigthRepository.findAll().size();

        // Create the Weigth with an existing ID
        weigth.setId(1L);
        WeigthDTO weigthDTO = weigthMapper.toDto(weigth);

        // An entity with an existing ID cannot be created, so this API call must fail
        restWeigthMockMvc.perform(post("/api/weigths")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(weigthDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Weigth in the database
        List<Weigth> weigthList = weigthRepository.findAll();
        assertThat(weigthList).hasSize(databaseSizeBeforeCreate);

        // Validate the Weigth in Elasticsearch
        verify(mockWeigthSearchRepository, times(0)).save(weigth);
    }

    @Test
    @Transactional
    public void checkTimestampIsRequired() throws Exception {
        int databaseSizeBeforeTest = weigthRepository.findAll().size();
        // set the field null
        weigth.setTimestamp(null);

        // Create the Weigth, which fails.
        WeigthDTO weigthDTO = weigthMapper.toDto(weigth);

        restWeigthMockMvc.perform(post("/api/weigths")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(weigthDTO)))
            .andExpect(status().isBadRequest());

        List<Weigth> weigthList = weigthRepository.findAll();
        assertThat(weigthList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkWeightIsRequired() throws Exception {
        int databaseSizeBeforeTest = weigthRepository.findAll().size();
        // set the field null
        weigth.setWeight(null);

        // Create the Weigth, which fails.
        WeigthDTO weigthDTO = weigthMapper.toDto(weigth);

        restWeigthMockMvc.perform(post("/api/weigths")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(weigthDTO)))
            .andExpect(status().isBadRequest());

        List<Weigth> weigthList = weigthRepository.findAll();
        assertThat(weigthList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllWeigths() throws Exception {
        // Initialize the database
        weigthRepository.saveAndFlush(weigth);

        // Create security-aware mockMvc
        restWeigthMockMvc = MockMvcBuilders
            .webAppContextSetup(context)
            .apply(springSecurity())
            .build();

        // Get all the weigthList
        restWeigthMockMvc.perform(get("/api/weigths?sort=id,desc")
            .with(user("admin").roles("ADMIN")))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(weigth.getId().intValue())))
            .andExpect(jsonPath("$.[*].timestamp").value(hasItem(sameInstant(DEFAULT_TIMESTAMP))))
            .andExpect(jsonPath("$.[*].weight").value(hasItem(DEFAULT_WEIGHT.doubleValue())));
    }
    
    @Test
    @Transactional
    public void getWeigth() throws Exception {
        // Initialize the database
        weigthRepository.saveAndFlush(weigth);

        // Get the weigth
        restWeigthMockMvc.perform(get("/api/weigths/{id}", weigth.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(weigth.getId().intValue()))
            .andExpect(jsonPath("$.timestamp").value(sameInstant(DEFAULT_TIMESTAMP)))
            .andExpect(jsonPath("$.weight").value(DEFAULT_WEIGHT.doubleValue()));
    }

    @Test
    @Transactional
    public void getNonExistingWeigth() throws Exception {
        // Get the weigth
        restWeigthMockMvc.perform(get("/api/weigths/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateWeigth() throws Exception {
        // Initialize the database
        weigthRepository.saveAndFlush(weigth);

        int databaseSizeBeforeUpdate = weigthRepository.findAll().size();

        // Create security-aware mockMvc
        restWeigthMockMvc = MockMvcBuilders
            .webAppContextSetup(context)
            .apply(springSecurity())
            .build();

        // Update the weigth
        Weigth updatedWeigth = weigthRepository.findById(weigth.getId()).get();
        // Disconnect from session so that the updates on updatedWeigth are not directly saved in db
        em.detach(updatedWeigth);
        updatedWeigth
            .timestamp(UPDATED_TIMESTAMP)
            .weight(UPDATED_WEIGHT);
        WeigthDTO weigthDTO = weigthMapper.toDto(updatedWeigth);

        restWeigthMockMvc.perform(put("/api/weigths")
            .with(user("user"))
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(weigthDTO)))
            .andExpect(status().isOk());

        // Validate the Weigth in the database
        List<Weigth> weigthList = weigthRepository.findAll();
        assertThat(weigthList).hasSize(databaseSizeBeforeUpdate);
        Weigth testWeigth = weigthList.get(weigthList.size() - 1);
        assertThat(testWeigth.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
        assertThat(testWeigth.getWeight()).isEqualTo(UPDATED_WEIGHT);

        // Validate the Weigth in Elasticsearch
        verify(mockWeigthSearchRepository, times(1)).save(testWeigth);
    }

    @Test
    @Transactional
    public void updateNonExistingWeigth() throws Exception {
        int databaseSizeBeforeUpdate = weigthRepository.findAll().size();

        // Create the Weigth
        WeigthDTO weigthDTO = weigthMapper.toDto(weigth);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWeigthMockMvc.perform(put("/api/weigths")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(weigthDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Weigth in the database
        List<Weigth> weigthList = weigthRepository.findAll();
        assertThat(weigthList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Weigth in Elasticsearch
        verify(mockWeigthSearchRepository, times(0)).save(weigth);
    }

    @Test
    @Transactional
    public void deleteWeigth() throws Exception {
        // Initialize the database
        weigthRepository.saveAndFlush(weigth);

        int databaseSizeBeforeDelete = weigthRepository.findAll().size();

        // Get the weigth
        restWeigthMockMvc.perform(delete("/api/weigths/{id}", weigth.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Weigth> weigthList = weigthRepository.findAll();
        assertThat(weigthList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Weigth in Elasticsearch
        verify(mockWeigthSearchRepository, times(1)).deleteById(weigth.getId());
    }

    @Test
    @Transactional
    public void searchWeigth() throws Exception {
        // Initialize the database
        weigthRepository.saveAndFlush(weigth);
        when(mockWeigthSearchRepository.search(queryStringQuery("id:" + weigth.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(weigth), PageRequest.of(0, 1), 1));
        // Search the weigth
        restWeigthMockMvc.perform(get("/api/_search/weigths?query=id:" + weigth.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(weigth.getId().intValue())))
            .andExpect(jsonPath("$.[*].timestamp").value(hasItem(sameInstant(DEFAULT_TIMESTAMP))))
            .andExpect(jsonPath("$.[*].weight").value(hasItem(DEFAULT_WEIGHT.doubleValue())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Weigth.class);
        Weigth weigth1 = new Weigth();
        weigth1.setId(1L);
        Weigth weigth2 = new Weigth();
        weigth2.setId(weigth1.getId());
        assertThat(weigth1).isEqualTo(weigth2);
        weigth2.setId(2L);
        assertThat(weigth1).isNotEqualTo(weigth2);
        weigth1.setId(null);
        assertThat(weigth1).isNotEqualTo(weigth2);
    }

    private void createByMonth(ZonedDateTime firstDate, ZonedDateTime firstDayOfLastMonth) {
        log.debug("firstDate: {}, firstOfLastMonth: {}", firstDate.toString(), firstDayOfLastMonth.toString());
        User user = userRepository.findOneByLogin("user").get();

        weigthRepository.saveAndFlush(new Weigth(firstDate, 205D, user));
        weigthRepository.saveAndFlush(new Weigth(firstDate.plusDays(10), 200D, user));
        weigthRepository.saveAndFlush(new Weigth(firstDate.plusDays(20), 195D, user));

        // last month
        weigthRepository.saveAndFlush(new Weigth(firstDayOfLastMonth, 208D, user));
        weigthRepository.saveAndFlush(new Weigth(firstDayOfLastMonth.plusDays(11), 206D, user));
        weigthRepository.saveAndFlush(new Weigth(firstDayOfLastMonth.plusDays(23), 204D, user));
    }

    @Test
    @Transactional
    public void getForLast30Days() throws Exception {
        ZonedDateTime now = ZonedDateTime.now();
        ZonedDateTime thirtyDaysAgo = now.minusDays(30);
        ZonedDateTime firstDayOfLastMonth = now.withDayOfMonth(1).minusMonths(1);
        createByMonth(thirtyDaysAgo, firstDayOfLastMonth);

        // create security-aware mockMvc
        restWeigthMockMvc = MockMvcBuilders
            .webAppContextSetup(context)
            .apply(springSecurity())
            .build();

        // Get all the weighIns
        restWeigthMockMvc.perform(get("/api/weigths")
            .with(user("user").roles("USER")))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$", hasSize(6)));

        // Get the weighIns for the last 30 days
        restWeigthMockMvc.perform(get("/api/weight-by-days/{days}", 30)
            .with(user("user").roles("USER")))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.period").value("Last 30 Days"))
            .andExpect(jsonPath("$.weighIns.[*].weight").value(hasItem(200D)));
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(WeigthDTO.class);
        WeigthDTO weigthDTO1 = new WeigthDTO();
        weigthDTO1.setId(1L);
        WeigthDTO weigthDTO2 = new WeigthDTO();
        assertThat(weigthDTO1).isNotEqualTo(weigthDTO2);
        weigthDTO2.setId(weigthDTO1.getId());
        assertThat(weigthDTO1).isEqualTo(weigthDTO2);
        weigthDTO2.setId(2L);
        assertThat(weigthDTO1).isNotEqualTo(weigthDTO2);
        weigthDTO1.setId(null);
        assertThat(weigthDTO1).isNotEqualTo(weigthDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(weigthMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(weigthMapper.fromId(null)).isNull();
    }
}
