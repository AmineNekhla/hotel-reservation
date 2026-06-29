package com.hotelreservation.mapper;

import com.hotelreservation.dto.request.RoomRequest;
import com.hotelreservation.dto.response.RoomResponse;
import com.hotelreservation.model.Room;
import org.springframework.stereotype.Component;

@Component
public class RoomMapper {

    public RoomResponse toResponse(Room room) {
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
                room.isAvailability(),
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
