package com.robmelfi.health.service.mapper;

import com.robmelfi.health.domain.*;
import com.robmelfi.health.service.dto.WeigthDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity Weigth and its DTO WeigthDTO.
 */
@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface WeigthMapper extends EntityMapper<WeigthDTO, Weigth> {

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.login", target = "userLogin")
    WeigthDTO toDto(Weigth weigth);

    @Mapping(source = "userId", target = "user")
    Weigth toEntity(WeigthDTO weigthDTO);

    default Weigth fromId(Long id) {
        if (id == null) {
            return null;
        }
        Weigth weigth = new Weigth();
        weigth.setId(id);
        return weigth;
    }
}
