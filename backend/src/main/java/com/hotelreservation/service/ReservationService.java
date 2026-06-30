package com.hotelreservation.service;

import com.hotelreservation.dto.request.ReservationRequest;
import com.hotelreservation.dto.response.ReservationResponse;
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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service handling all reservation business logic including date validation,
 * overlap detection, and status management.
 */
@Service
@Transactional(readOnly = true)
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final ReservationMapper reservationMapper;

    public ReservationService(ReservationRepository reservationRepository,
                              UserRepository userRepository,
                              RoomRepository roomRepository,
                              ReservationMapper reservationMapper) {
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
        this.reservationMapper = reservationMapper;
    }

    /**
     * Retrieves all reservations in the system (admin-only use).
     *
     * @return list of all reservations
     */
    public List<ReservationResponse> getAllReservations() {
        return reservationRepository.findAll().stream()
                .map(reservationMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a single reservation by ID.
     *
     * @param id the reservation ID
     * @return the matching reservation
     * @throws ResourceNotFoundException if not found
     */
    public ReservationResponse getReservationById(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));
        return reservationMapper.toResponse(reservation);
    }

    /**
     * Retrieves all reservations belonging to a specific user.
     *
     * @param userId the user's ID
     * @return list of reservations for that user
     */
    public List<ReservationResponse> getReservationsByUserId(Long userId) {
        return reservationRepository.findByUserId(userId).stream()
                .map(reservationMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves all reservations belonging to a user identified by email.
     *
     * @param email the user's email address (from the JWT subject)
     * @return list of reservations for that user
     * @throws ResourceNotFoundException if no user exists with the given email
     */
    public List<ReservationResponse> getReservationsByUserEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return getReservationsByUserId(user.getId());
    }

    /**
     * Creates a new reservation after validating dates and checking for conflicts.
     * <p>
     * Business rules enforced:
     * <ul>
     *   <li>Check-in must be strictly before check-out.</li>
     *   <li>Room must be marked as available.</li>
     *   <li>No existing CONFIRMED reservation may overlap with the requested dates.</li>
     * </ul>
     * New reservations start in {@link ReservationStatus#PENDING} state and must be
     * approved by an admin.
     * </p>
     *
     * @param request   validated reservation request payload
     * @param userEmail email of the currently authenticated user
     * @return the newly created reservation
     * @throws BadRequestException       if the date range is invalid
     * @throws ResourceNotFoundException if the user or room does not exist
     * @throws ConflictException         if the room is unavailable or already booked
     */
    @Transactional
    public ReservationResponse createReservation(ReservationRequest request, String userEmail) {
        if (request.getStartDate().isAfter(request.getEndDate())
                || request.getStartDate().isEqual(request.getEndDate())) {
            throw new BadRequestException("Check-in date must be strictly before check-out date");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + request.getRoomId()));


        boolean hasOverlap = reservationRepository.hasOverlappingReservation(
                room.getId(), request.getStartDate(), request.getEndDate(), ReservationStatus.CONFIRMED);

        if (hasOverlap) {
            throw new ConflictException("Room is already booked for the selected dates");
        }

        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setRoom(room);
        reservation.setStartDate(request.getStartDate());
        reservation.setEndDate(request.getEndDate());
        reservation.setStatus(ReservationStatus.PENDING);

        return reservationMapper.toResponse(reservationRepository.save(reservation));
    }

    /**
     * Updates the status of an existing reservation.
     *
     * @param id     the reservation ID
     * @param status the new target status
     * @return the updated reservation
     * @throws ResourceNotFoundException if the reservation does not exist
     */
    @Transactional
    public ReservationResponse updateReservationStatus(Long id, ReservationStatus status) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));
        reservation.setStatus(status);
        return reservationMapper.toResponse(reservationRepository.save(reservation));
    }

    /**
     * Cancels a reservation. Only the reservation owner or an admin may cancel.
     *
     * @param id        the reservation ID
     * @param userEmail the email of the requesting user
     * @throws ResourceNotFoundException if the reservation or user does not exist
     * @throws BadRequestException       if the user does not own the reservation
     */
    @Transactional
    public void cancelReservation(Long id, String userEmail) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean isAdmin = "ADMIN".equals(user.getRole());
        boolean isOwner = reservation.getUser().getId().equals(user.getId());

        if (!isAdmin && !isOwner) {
            throw new BadRequestException("You do not have permission to cancel this reservation");
        }

        reservation.setStatus(ReservationStatus.CANCELLED);
        reservationRepository.save(reservation);
    }

    /**
     * Permanently deletes a reservation record (admin operation).
     *
     * @param id the reservation ID
     * @throws ResourceNotFoundException if the reservation does not exist
     */
    @Transactional
    public void deleteReservation(Long id) {
        if (!reservationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Reservation not found with id: " + id);
        }
        reservationRepository.deleteById(id);
    }
}