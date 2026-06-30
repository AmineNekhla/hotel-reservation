package com.hotelreservation.service;

import com.hotelreservation.dto.request.ReservationRequest;
import com.hotelreservation.exception.BadRequestException;
import com.hotelreservation.exception.ConflictException;
import com.hotelreservation.exception.ResourceNotFoundException;
import com.hotelreservation.mapper.ReservationMapper;
import com.hotelreservation.model.Reservation;
import com.hotelreservation.model.ReservationStatus;
import com.hotelreservation.model.Room;
import com.hotelreservation.model.User;
import com.hotelreservation.repository.ReservationRepository;
import com.hotelreservation.repository.RoomRepository;
import com.hotelreservation.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for {@link ReservationService}.
 * <p>
 * All external dependencies are mocked with Mockito so tests run in isolation
 * without requiring a Spring context or database connection.
 * </p>
 */
@ExtendWith(MockitoExtension.class)
class ReservationServiceTest {

    @Mock private ReservationRepository reservationRepository;
    @Mock private UserRepository userRepository;
    @Mock private RoomRepository roomRepository;
    @Mock private ReservationMapper reservationMapper;

    @InjectMocks
    private ReservationService reservationService;

    private User testUser;
    private Room testRoom;
    private ReservationRequest validRequest;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setName("John Doe");
        testUser.setEmail("john@example.com");
        testUser.setRole("USER");

        testRoom = new Room();
        testRoom.setId(10L);
        testRoom.setType("Suite");

        validRequest = new ReservationRequest();
        validRequest.setRoomId(10L);
        validRequest.setStartDate(LocalDate.of(2025, 8, 1));
        validRequest.setEndDate(LocalDate.of(2025, 8, 5));
    }

    // ─── Date Validation ───────────────────────────────────────────────────────

    @Test
    @DisplayName("createReservation should throw BadRequestException when start date equals end date")
    void createReservation_sameDate_throwsBadRequest() {
        validRequest.setStartDate(LocalDate.of(2025, 8, 1));
        validRequest.setEndDate(LocalDate.of(2025, 8, 1));

        assertThatThrownBy(() -> reservationService.createReservation(validRequest, "john@example.com"))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("strictly before");
    }

    @Test
    @DisplayName("createReservation should throw BadRequestException when start date is after end date")
    void createReservation_startAfterEnd_throwsBadRequest() {
        validRequest.setStartDate(LocalDate.of(2025, 8, 10));
        validRequest.setEndDate(LocalDate.of(2025, 8, 1));

        assertThatThrownBy(() -> reservationService.createReservation(validRequest, "john@example.com"))
                .isInstanceOf(BadRequestException.class);
    }

    // ─── User / Room Not Found ─────────────────────────────────────────────────

    @Test
    @DisplayName("createReservation should throw ResourceNotFoundException when user does not exist")
    void createReservation_userNotFound_throwsNotFound() {
        when(userRepository.findByEmail("nobody@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> reservationService.createReservation(validRequest, "nobody@example.com"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("User not found");
    }

    @Test
    @DisplayName("createReservation should throw ResourceNotFoundException when room does not exist")
    void createReservation_roomNotFound_throwsNotFound() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(roomRepository.findById(10L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> reservationService.createReservation(validRequest, "john@example.com"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Room not found");
    }

    // ─── Room Availability ─────────────────────────────────────────────────────


    @Test
    @DisplayName("createReservation should throw ConflictException when date range overlaps an existing booking")
    void createReservation_overlappingDates_throwsConflict() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(roomRepository.findById(10L)).thenReturn(Optional.of(testRoom));
        when(reservationRepository.hasOverlappingReservation(
                eq(10L), any(), any(), eq(ReservationStatus.CONFIRMED)
        )).thenReturn(true);

        assertThatThrownBy(() -> reservationService.createReservation(validRequest, "john@example.com"))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("already booked");
    }

    // ─── Successful Creation ───────────────────────────────────────────────────

    @Test
    @DisplayName("createReservation should save with PENDING status when all validations pass")
    void createReservation_validRequest_savesPendingReservation() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(roomRepository.findById(10L)).thenReturn(Optional.of(testRoom));
        when(reservationRepository.hasOverlappingReservation(any(), any(), any(), any()))
                .thenReturn(false);

        Reservation savedReservation = new Reservation();
        savedReservation.setStatus(ReservationStatus.PENDING);
        when(reservationRepository.save(any(Reservation.class))).thenReturn(savedReservation);
        when(reservationMapper.toResponse(any())).thenReturn(null); // response shape tested separately

        reservationService.createReservation(validRequest, "john@example.com");

        verify(reservationRepository).save(argThat(r -> r.getStatus() == ReservationStatus.PENDING));
    }

    // ─── Cancellation ─────────────────────────────────────────────────────────

    @Test
    @DisplayName("cancelReservation should throw BadRequestException when user does not own the reservation")
    void cancelReservation_notOwner_throwsBadRequest() {
        User anotherUser = new User();
        anotherUser.setId(99L);
        anotherUser.setEmail("other@example.com");
        anotherUser.setRole("USER");

        Reservation reservation = new Reservation();
        reservation.setId(1L);
        reservation.setUser(testUser); // owned by testUser (id=1)
        reservation.setStatus(ReservationStatus.PENDING);

        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));
        when(userRepository.findByEmail("other@example.com")).thenReturn(Optional.of(anotherUser));

        assertThatThrownBy(() -> reservationService.cancelReservation(1L, "other@example.com"))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("permission");
    }

    @Test
    @DisplayName("cancelReservation should succeed when user is the reservation owner")
    void cancelReservation_owner_setsStatusToCancelled() {
        Reservation reservation = new Reservation();
        reservation.setId(1L);
        reservation.setUser(testUser);
        reservation.setStatus(ReservationStatus.PENDING);

        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(testUser));
        when(reservationRepository.save(any())).thenReturn(reservation);

        reservationService.cancelReservation(1L, "john@example.com");

        assertThat(reservation.getStatus()).isEqualTo(ReservationStatus.CANCELLED);
        verify(reservationRepository).save(reservation);
    }

    @Test
    @DisplayName("cancelReservation should succeed when user is an ADMIN regardless of ownership")
    void cancelReservation_admin_succeeds() {
        testUser.setRole("ADMIN");

        User owner = new User();
        owner.setId(50L);
        owner.setRole("USER");

        Reservation reservation = new Reservation();
        reservation.setId(1L);
        reservation.setUser(owner);
        reservation.setStatus(ReservationStatus.CONFIRMED);

        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(testUser));
        when(reservationRepository.save(any())).thenReturn(reservation);

        reservationService.cancelReservation(1L, "john@example.com");

        assertThat(reservation.getStatus()).isEqualTo(ReservationStatus.CANCELLED);
    }
}
