package com.robmelfi.health.repository.search;

import com.robmelfi.health.domain.Weigth;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Weigth entity.
 */
public interface WeigthSearchRepository extends ElasticsearchRepository<Weigth, Long> {
}
