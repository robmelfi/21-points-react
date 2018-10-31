package com.robmelfi.health.web.rest;

import com.robmelfi.health.TwentyOnePointsReactApp;

import com.robmelfi.health.domain.Points;
import com.robmelfi.health.domain.User;
import com.robmelfi.health.repository.PointsRepository;
import com.robmelfi.health.repository.UserRepository;
import com.robmelfi.health.repository.search.PointsSearchRepository;
import com.robmelfi.health.service.PointsService;
import com.robmelfi.health.service.dto.PointsDTO;
import com.robmelfi.health.service.mapper.PointsMapper;
import com.robmelfi.health.web.rest.errors.ExceptionTranslator;

import org.checkerframework.checker.units.qual.A;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cglib.core.Local;
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
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
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
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the PointsResource REST controller.
 *
 * @see PointsResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = TwentyOnePointsReactApp.class)
public class PointsResourceIntTest {

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final Integer DEFAULT_EXCERCISE = 1;
    private static final Integer UPDATED_EXCERCISE = 2;

    private static final Integer DEFAULT_MEALS = 1;
    private static final Integer UPDATED_MEALS = 2;

    private static final Integer DEFAULT_ALCOHOL = 1;
    private static final Integer UPDATED_ALCOHOL = 2;

    private static final String DEFAULT_NOTES = "AAAAAAAAAA";
    private static final String UPDATED_NOTES = "BBBBBBBBBB";

    @Autowired
    private PointsRepository pointsRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PointsMapper pointsMapper;
    
    @Autowired
    private PointsService pointsService;

    @Autowired
    private WebApplicationContext context;

    /**
     * This repository is mocked in the com.robmelfi.health.repository.search test package.
     *
     * @see com.robmelfi.health.repository.search.PointsSearchRepositoryMockConfiguration
     */
    @Autowired
    private PointsSearchRepository mockPointsSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restPointsMockMvc;

    private Points points;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final PointsResource pointsResource = new PointsResource(pointsService);
        this.restPointsMockMvc = MockMvcBuilders.standaloneSetup(pointsResource)
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
    public static Points createEntity(EntityManager em) {
        Points points = new Points()
            .date(DEFAULT_DATE)
            .excercise(DEFAULT_EXCERCISE)
            .meals(DEFAULT_MEALS)
            .alcohol(DEFAULT_ALCOHOL)
            .notes(DEFAULT_NOTES);
        // Add required entity
        User user = UserResourceIntTest.createEntity(em);
        em.persist(user);
        em.flush();
        points.setUser(user);
        return points;
    }

    @Before
    public void initTest() {
        points = createEntity(em);
    }

    @Test
    @Transactional
    public void createPoints() throws Exception {
        int databaseSizeBeforeCreate = pointsRepository.findAll().size();

        // Create security-aware mockMvc
        restPointsMockMvc = MockMvcBuilders
            .webAppContextSetup(context)
            .apply(springSecurity())
            .build();

        // Create the Points
        PointsDTO pointsDTO = pointsMapper.toDto(points);
        restPointsMockMvc.perform(post("/api/points")
            .with(user("user"))
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(pointsDTO)))
            .andExpect(status().isCreated());

        // Validate the Points in the database
        List<Points> pointsList = pointsRepository.findAll();
        assertThat(pointsList).hasSize(databaseSizeBeforeCreate + 1);
        Points testPoints = pointsList.get(pointsList.size() - 1);
        assertThat(testPoints.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testPoints.getExcercise()).isEqualTo(DEFAULT_EXCERCISE);
        assertThat(testPoints.getMeals()).isEqualTo(DEFAULT_MEALS);
        assertThat(testPoints.getAlcohol()).isEqualTo(DEFAULT_ALCOHOL);
        assertThat(testPoints.getNotes()).isEqualTo(DEFAULT_NOTES);

        // Validate the Points in Elasticsearch
        verify(mockPointsSearchRepository, times(1)).save(testPoints);
    }

    @Test
    @Transactional
    public void createPointsWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = pointsRepository.findAll().size();

        // Create the Points with an existing ID
        points.setId(1L);
        PointsDTO pointsDTO = pointsMapper.toDto(points);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPointsMockMvc.perform(post("/api/points")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(pointsDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Points in the database
        List<Points> pointsList = pointsRepository.findAll();
        assertThat(pointsList).hasSize(databaseSizeBeforeCreate);

        // Validate the Points in Elasticsearch
        verify(mockPointsSearchRepository, times(0)).save(points);
    }

    @Test
    @Transactional
    public void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = pointsRepository.findAll().size();
        // set the field null
        points.setDate(null);

        // Create the Points, which fails.
        PointsDTO pointsDTO = pointsMapper.toDto(points);

        restPointsMockMvc.perform(post("/api/points")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(pointsDTO)))
            .andExpect(status().isBadRequest());

        List<Points> pointsList = pointsRepository.findAll();
        assertThat(pointsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllPoints() throws Exception {
        // Initialize the database
        pointsRepository.saveAndFlush(points);

        // Create security-aware mockMvc
        restPointsMockMvc = MockMvcBuilders
            .webAppContextSetup(context)
            .apply(springSecurity())
            .build();

        // Get all the pointsList
        restPointsMockMvc.perform(get("/api/points?sort=id,desc")
            .with(user("admin").roles("ADMIN")))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(points.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].excercise").value(hasItem(DEFAULT_EXCERCISE)))
            .andExpect(jsonPath("$.[*].meals").value(hasItem(DEFAULT_MEALS)))
            .andExpect(jsonPath("$.[*].alcohol").value(hasItem(DEFAULT_ALCOHOL)))
            .andExpect(jsonPath("$.[*].notes").value(hasItem(DEFAULT_NOTES.toString())));
    }
    
    @Test
    @Transactional
    public void getPoints() throws Exception {
        // Initialize the database
        pointsRepository.saveAndFlush(points);

        // Get the points
        restPointsMockMvc.perform(get("/api/points/{id}", points.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(points.getId().intValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.excercise").value(DEFAULT_EXCERCISE))
            .andExpect(jsonPath("$.meals").value(DEFAULT_MEALS))
            .andExpect(jsonPath("$.alcohol").value(DEFAULT_ALCOHOL))
            .andExpect(jsonPath("$.notes").value(DEFAULT_NOTES.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingPoints() throws Exception {
        // Get the points
        restPointsMockMvc.perform(get("/api/points/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePoints() throws Exception {
        // Initialize the database
        pointsRepository.saveAndFlush(points);

        int databaseSizeBeforeUpdate = pointsRepository.findAll().size();

        // Create security-aware mockMvc
        restPointsMockMvc = MockMvcBuilders
            .webAppContextSetup(context)
            .apply(springSecurity())
            .build();

        // Update the points
        Points updatedPoints = pointsRepository.findById(points.getId()).get();
        // Disconnect from session so that the updates on updatedPoints are not directly saved in db
        em.detach(updatedPoints);
        updatedPoints
            .date(UPDATED_DATE)
            .excercise(UPDATED_EXCERCISE)
            .meals(UPDATED_MEALS)
            .alcohol(UPDATED_ALCOHOL)
            .notes(UPDATED_NOTES);
        PointsDTO pointsDTO = pointsMapper.toDto(updatedPoints);

        restPointsMockMvc.perform(put("/api/points")
            .with(user("user"))
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(pointsDTO)))
            .andExpect(status().isOk());

        // Validate the Points in the database
        List<Points> pointsList = pointsRepository.findAll();
        assertThat(pointsList).hasSize(databaseSizeBeforeUpdate);
        Points testPoints = pointsList.get(pointsList.size() - 1);
        assertThat(testPoints.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testPoints.getExcercise()).isEqualTo(UPDATED_EXCERCISE);
        assertThat(testPoints.getMeals()).isEqualTo(UPDATED_MEALS);
        assertThat(testPoints.getAlcohol()).isEqualTo(UPDATED_ALCOHOL);
        assertThat(testPoints.getNotes()).isEqualTo(UPDATED_NOTES);

        // Validate the Points in Elasticsearch
        verify(mockPointsSearchRepository, times(1)).save(testPoints);
    }

    @Test
    @Transactional
    public void updateNonExistingPoints() throws Exception {
        int databaseSizeBeforeUpdate = pointsRepository.findAll().size();

        // Create the Points
        PointsDTO pointsDTO = pointsMapper.toDto(points);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPointsMockMvc.perform(put("/api/points")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(pointsDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Points in the database
        List<Points> pointsList = pointsRepository.findAll();
        assertThat(pointsList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Points in Elasticsearch
        verify(mockPointsSearchRepository, times(0)).save(points);
    }

    @Test
    @Transactional
    public void deletePoints() throws Exception {
        // Initialize the database
        pointsRepository.saveAndFlush(points);

        int databaseSizeBeforeDelete = pointsRepository.findAll().size();

        // Get the points
        restPointsMockMvc.perform(delete("/api/points/{id}", points.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Points> pointsList = pointsRepository.findAll();
        assertThat(pointsList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Points in Elasticsearch
        verify(mockPointsSearchRepository, times(1)).deleteById(points.getId());
    }

    @Test
    @Transactional
    public void searchPoints() throws Exception {
        // Initialize the database
        pointsRepository.saveAndFlush(points);
        when(mockPointsSearchRepository.search(queryStringQuery("id:" + points.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(points), PageRequest.of(0, 1), 1));
        // Search the points
        restPointsMockMvc.perform(get("/api/_search/points?query=id:" + points.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(points.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].excercise").value(hasItem(DEFAULT_EXCERCISE)))
            .andExpect(jsonPath("$.[*].meals").value(hasItem(DEFAULT_MEALS)))
            .andExpect(jsonPath("$.[*].alcohol").value(hasItem(DEFAULT_ALCOHOL)))
            .andExpect(jsonPath("$.[*].notes").value(hasItem(DEFAULT_NOTES.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Points.class);
        Points points1 = new Points();
        points1.setId(1L);
        Points points2 = new Points();
        points2.setId(points1.getId());
        assertThat(points1).isEqualTo(points2);
        points2.setId(2L);
        assertThat(points1).isNotEqualTo(points2);
        points1.setId(null);
        assertThat(points1).isNotEqualTo(points2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(PointsDTO.class);
        PointsDTO pointsDTO1 = new PointsDTO();
        pointsDTO1.setId(1L);
        PointsDTO pointsDTO2 = new PointsDTO();
        assertThat(pointsDTO1).isNotEqualTo(pointsDTO2);
        pointsDTO2.setId(pointsDTO1.getId());
        assertThat(pointsDTO1).isEqualTo(pointsDTO2);
        pointsDTO2.setId(2L);
        assertThat(pointsDTO1).isNotEqualTo(pointsDTO2);
        pointsDTO1.setId(null);
        assertThat(pointsDTO1).isNotEqualTo(pointsDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(pointsMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(pointsMapper.fromId(null)).isNull();
    }

    private void createPointsByWeek(LocalDate thisMonday, LocalDate lastMonday) {
        User user = userRepository.findOneByLogin("user").get();
        // Create points in two separate weeks
        Points points = new Points().date(thisMonday.plusDays(2)).excercise(1).meals(1).alcohol(1).user(user);
        pointsRepository.saveAndFlush(points);

        points = new Points().date(thisMonday.plusDays(3)).excercise(1).meals(1).alcohol(0).user(user);
        pointsRepository.saveAndFlush(points);

        points = new Points().date(lastMonday.plusDays(3)).excercise(0).meals(0).alcohol(1).user(user);
        pointsRepository.saveAndFlush(points);

        points = new Points().date(lastMonday.plusDays(4)).excercise(1).meals(1).alcohol(0).user(user);
        pointsRepository.saveAndFlush(points);
    }

    @Test
    @Transactional
    public void getPointsThisWeek() throws Exception {
        LocalDate today = LocalDate.now();
        LocalDate thisMonday = today.with(DayOfWeek.MONDAY);
        LocalDate lastMonday = thisMonday.minusWeeks(1);
        createPointsByWeek(thisMonday, lastMonday);

        // create security-aware mockMvc
        restPointsMockMvc = MockMvcBuilders
            .webAppContextSetup(context)
            .apply(springSecurity())
            .build();

        // Get all the points
        restPointsMockMvc.perform(get("/api/points-this-week")
            .with(user("user").roles("USER")))
            .andExpect(status().isOk())
            .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.week").value(thisMonday.toString()))
            .andExpect(jsonPath("$.points").value(5));
    }

    @Test
    @Transactional
    public void getPointsByMonth() throws Exception {
        LocalDate today = LocalDate.now();
        LocalDate thisMonday = today.with(DayOfWeek.MONDAY);
        LocalDate lastMonday = thisMonday.minusDays(7);
        createPointsByWeek(thisMonday, lastMonday);

        // create security-aware mockMvc
        restPointsMockMvc = MockMvcBuilders
            .webAppContextSetup(context)
            .apply(springSecurity())
            .build();

        // Get the points for last month
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM");
        String startDate = fmt.format(today.withDayOfMonth(1));
        LocalDate firstDate = thisMonday.plusDays(2);
        LocalDate secondDate = thisMonday.plusDays(3);

        // see if adding days takes you into next month
        if (today.getMonthValue() < firstDate.getMonthValue() || today.getMonthValue() < secondDate.getMonthValue()) {
            // if so, look for second set of dates
            firstDate = lastMonday.plusDays(3);
            secondDate = lastMonday.plusDays(4);
        }

        restPointsMockMvc.perform(get("/api/points-by-month/{yearWithMonth}", startDate)
            .with(user("user").roles("USER")))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.month").value(startDate))
            .andExpect(jsonPath("$.points.[*].date").value(hasItem(firstDate.toString())))
            .andExpect(jsonPath("$.points.[*].date").value(hasItem(secondDate.toString())));
    }
}
