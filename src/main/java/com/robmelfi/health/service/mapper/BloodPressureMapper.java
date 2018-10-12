package com.robmelfi.health.service.mapper;

import com.robmelfi.health.domain.*;
import com.robmelfi.health.service.dto.BloodPressureDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity BloodPressure and its DTO BloodPressureDTO.
 */
@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface BloodPressureMapper extends EntityMapper<BloodPressureDTO, BloodPressure> {

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.login", target = "userLogin")
    BloodPressureDTO toDto(BloodPressure bloodPressure);

    @Mapping(source = "userId", target = "user")
    BloodPressure toEntity(BloodPressureDTO bloodPressureDTO);

    default BloodPressure fromId(Long id) {
        if (id == null) {
            return null;
        }
        BloodPressure bloodPressure = new BloodPressure();
        bloodPressure.setId(id);
        return bloodPressure;
    }
}
