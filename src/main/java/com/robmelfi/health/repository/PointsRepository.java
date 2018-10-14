package com.robmelfi.health.repository;

import com.robmelfi.health.domain.Points;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the Points entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PointsRepository extends JpaRepository<Points, Long> {

    @Query("select points from Points points where points.user.login = ?#{principal.username} order by points.date desc")
    Page<Points> findByUserIsCurrentUser(Pageable pageable);

    Page<Points> findAllByOrderByDateDesc(Pageable pageable);

}
