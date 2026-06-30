package com.hotelreservation.service;

import com.hotelreservation.dto.response.RoomResponse;
import com.hotelreservation.mapper.RoomMapper;
import com.hotelreservation.model.ReservationStatus;
import com.hotelreservation.model.Room;
import com.hotelreservation.repository.ReservationRepository;
import com.hotelreservation.repository.RoomRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RoomServiceTest {

    @Mock
    private RoomRepository roomRepository;

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private RoomMapper roomMapper;

    @InjectMocks
    private RoomService roomService;

    private Room testRoom;
    private RoomResponse availableResponse;
    private RoomResponse unavailableResponse;

    @BeforeEach
    void setUp() {
        testRoom = new Room();
        testRoom.setId(102L);
        testRoom.setRoomNumber("102");
        testRoom.setType("Double");

        availableResponse = new RoomResponse(
                102L, "102", "Double", "Desc", 80.0, 2, true, "url"
        );
        unavailableResponse = new RoomResponse(
                102L, "102", "Double", "Desc", 80.0, 2, false, "url"
        );
    }

    @Test
    void getRoomById_roomAvailable_returnsAvailableTrue() {
        when(roomRepository.findById(102L)).thenReturn(Optional.of(testRoom));
        when(reservationRepository.hasOverlappingReservation(
                eq(102L), any(), any(), eq(ReservationStatus.CONFIRMED)))
                .thenReturn(false);
        when(roomMapper.toResponse(testRoom, true)).thenReturn(availableResponse);

        RoomResponse response = roomService.getRoomById(102L);

        assertThat(response.isAvailability()).isTrue();
    }

    @Test
    void getRoomById_roomReservedToday_returnsAvailableFalse() {
        when(roomRepository.findById(102L)).thenReturn(Optional.of(testRoom));
        when(reservationRepository.hasOverlappingReservation(
                eq(102L), any(), any(), eq(ReservationStatus.CONFIRMED)))
                .thenReturn(true);
        when(roomMapper.toResponse(testRoom, false)).thenReturn(unavailableResponse);

        RoomResponse response = roomService.getRoomById(102L);

        assertThat(response.isAvailability()).isFalse();
    }

    @Test
    void getAllRooms_calculatesAvailabilityDynamically() {
        Room room2 = new Room();
        room2.setId(103L);

        when(roomRepository.findAll()).thenReturn(List.of(testRoom, room2));
        
        // 102 is occupied, 103 is not
        when(reservationRepository.findOccupiedRoomIdsOnDate(any(), eq(ReservationStatus.CONFIRMED)))
                .thenReturn(List.of(102L));
                
        RoomResponse room2Response = new RoomResponse(
                103L, "103", "Single", "Desc", 50.0, 1, true, "url");

        when(roomMapper.toResponse(testRoom, false)).thenReturn(unavailableResponse);
        when(roomMapper.toResponse(room2, true)).thenReturn(room2Response);

        List<RoomResponse> rooms = roomService.getAllRooms();

        assertThat(rooms).hasSize(2);
        assertThat(rooms.get(0).isAvailability()).isFalse(); // 102 is unavailable
        assertThat(rooms.get(1).isAvailability()).isTrue();  // 103 is available
    }
}
