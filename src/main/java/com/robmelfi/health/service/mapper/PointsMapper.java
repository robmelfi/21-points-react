package com.robmelfi.health.service.mapper;

import com.robmelfi.health.domain.*;
import com.robmelfi.health.service.dto.PointsDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity Points and its DTO PointsDTO.
 */
@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface PointsMapper extends EntityMapper<PointsDTO, Points> {

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.login", target = "userLogin")
    PointsDTO toDto(Points points);

    @Mapping(source = "userId", target = "user")
    Points toEntity(PointsDTO pointsDTO);

    default Points fromId(Long id) {
        if (id == null) {
            return null;
        }
        Points points = new Points();
        points.setId(id);
        return points;
    }
}
