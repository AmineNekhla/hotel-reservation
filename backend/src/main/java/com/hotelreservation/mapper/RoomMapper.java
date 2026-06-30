package com.hotelreservation.mapper;

import com.hotelreservation.dto.request.RoomRequest;
import com.hotelreservation.dto.response.RoomResponse;
import com.hotelreservation.model.ReservationStatus;
import com.hotelreservation.model.Room;
import com.hotelreservation.repository.ReservationRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class RoomMapper {

    private final ReservationRepository reservationRepository;

    public RoomMapper(@Lazy ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    public RoomResponse toResponse(Room room) {
        if (room == null) {
            return null;
        }
        boolean isAvailable = !reservationRepository.hasOverlappingReservation(
                room.getId(), LocalDate.now(), LocalDate.now().plusDays(1), ReservationStatus.CONFIRMED);
        return toResponse(room, isAvailable);
    }

    public RoomResponse toResponse(Room room, boolean isAvailable) {
        if (room == null) {
            return null;
        }
        return new RoomResponse(
                room.getId(),
                room.getRoomNumber(),
                room.getType(),
                room.getDescription(),
                room.getPrice(),
                room.getCapacity(),
                isAvailable,
                room.getImageUrl()
        );
    }

    public Room toEntity(RoomRequest request) {
        if (request == null) {
            return null;
        }
        Room room = new Room();
        room.setRoomNumber(request.getRoomNumber());
        room.setType(request.getType());
        room.setDescription(request.getDescription());
        room.setPrice(request.getPrice());
        room.setCapacity(request.getCapacity());
        room.setImageUrl(request.getImageUrl());
        return room;
    }
}
