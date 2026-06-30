package com.hotelreservation.service;

import com.hotelreservation.dto.request.RoomRequest;
import com.hotelreservation.dto.response.RoomResponse;
import com.hotelreservation.exception.ResourceNotFoundException;
import com.hotelreservation.mapper.RoomMapper;
import com.hotelreservation.model.Room;
import com.hotelreservation.repository.RoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service handling all business logic related to hotel room management.
 */
@Service
@Transactional(readOnly = true)
public class RoomService {

    private final RoomRepository roomRepository;
    private final RoomMapper roomMapper;

    public RoomService(RoomRepository roomRepository, RoomMapper roomMapper) {
        this.roomRepository = roomRepository;
        this.roomMapper = roomMapper;
    }

    /**
     * Retrieves all hotel rooms.
     *
     * @return list of all rooms as {@link RoomResponse}
     */
    public List<RoomResponse> getAllRooms() {
        return roomRepository.findAll().stream()
                .map(roomMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a single room by its ID.
     *
     * @param id the room ID
     * @return the matching room as {@link RoomResponse}
     * @throws ResourceNotFoundException if no room exists with the given ID
     */
    public RoomResponse getRoomById(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));
        return roomMapper.toResponse(room);
    }

    /**
     * Creates a new hotel room. Availability defaults to {@code true}.
     *
     * @param request validated room creation payload
     * @return the newly created room as {@link RoomResponse}
     */
    @Transactional
    public RoomResponse createRoom(RoomRequest request) {
        Room room = roomMapper.toEntity(request);
        room.setAvailability(true);
        return roomMapper.toResponse(roomRepository.save(room));
    }

    /**
     * Updates all mutable fields of an existing room.
     *
     * @param id      the ID of the room to update
     * @param request validated update payload
     * @return the updated room as {@link RoomResponse}
     * @throws ResourceNotFoundException if no room exists with the given ID
     */
    @Transactional
    public RoomResponse updateRoom(Long id, RoomRequest request) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));

        room.setRoomNumber(request.getRoomNumber());
        room.setType(request.getType());
        room.setDescription(request.getDescription());
        room.setPrice(request.getPrice());
        room.setCapacity(request.getCapacity());
        room.setImageUrl(request.getImageUrl());

        return roomMapper.toResponse(roomRepository.save(room));
    }

    /**
     * Deletes a room by its ID.
     *
     * @param id the ID of the room to delete
     * @throws ResourceNotFoundException if no room exists with the given ID
     */
    @Transactional
    public void deleteRoom(Long id) {
        if (!roomRepository.existsById(id)) {
            throw new ResourceNotFoundException("Room not found with id: " + id);
        }
        roomRepository.deleteById(id);
    }
}