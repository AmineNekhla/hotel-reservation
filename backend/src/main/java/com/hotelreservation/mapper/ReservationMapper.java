package com.hotelreservation.mapper;

import com.hotelreservation.dto.response.ReservationResponse;
import com.hotelreservation.model.Reservation;

/**
 * Contract for mapping {@link Reservation} entities to {@link ReservationResponse} DTOs.
 */
public interface ReservationMapper {

    /**
     * Maps a {@link Reservation} entity to a {@link ReservationResponse} DTO.
     *
     * @param reservation the entity to map; may be {@code null}
     * @return the mapped DTO, or {@code null} if the input is null
     */
    ReservationResponse toResponse(Reservation reservation);
}
