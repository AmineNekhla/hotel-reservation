package com.hotelreservation.mapper;

import com.hotelreservation.dto.response.ReservationResponse;
import com.hotelreservation.model.Reservation;
import org.springframework.stereotype.Component;

/**
 * Default implementation of {@link ReservationMapper}.
 */
@Component
public class ReservationMapperImpl implements ReservationMapper {

    private final UserMapper userMapper;
    private final RoomMapper roomMapper;

    public ReservationMapperImpl(UserMapper userMapper, RoomMapper roomMapper) {
        this.userMapper = userMapper;
        this.roomMapper = roomMapper;
    }

    @Override
    public ReservationResponse toResponse(Reservation reservation) {
        if (reservation == null) {
            return null;
        }
        return new ReservationResponse(
                reservation.getId(),
                userMapper.toResponse(reservation.getUser()),
                roomMapper.toResponse(reservation.getRoom()),
                reservation.getStartDate(),
                reservation.getEndDate(),
                reservation.getStatus(),
                reservation.getCreatedAt()
        );
    }
}
