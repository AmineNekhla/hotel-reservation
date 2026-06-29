package com.hotelreservation.controller;

import com.hotelreservation.dto.request.RoomRequest;
import com.hotelreservation.dto.response.ReservationResponse;
import com.hotelreservation.dto.response.RoomResponse;
import com.hotelreservation.dto.response.StatsResponse;
import com.hotelreservation.dto.response.UserResponse;
import com.hotelreservation.model.ReservationStatus;
import com.hotelreservation.repository.ReservationRepository;
import com.hotelreservation.repository.RoomRepository;
import com.hotelreservation.repository.UserRepository;
import com.hotelreservation.service.ReservationService;
import com.hotelreservation.service.RoomService;
import com.hotelreservation.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserService userService;
    private final RoomService roomService;
    private final ReservationService reservationService;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final ReservationRepository reservationRepository;

    public AdminController(UserService userService, RoomService roomService,
                           ReservationService reservationService, UserRepository userRepository,
                           RoomRepository roomRepository, ReservationRepository reservationRepository) {
        this.userService = userService;
        this.roomService = roomService;
        this.reservationService = reservationService;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
        this.reservationRepository = reservationRepository;
    }

    // DASHBOARD STATS
    @GetMapping("/stats")
    public ResponseEntity<StatsResponse> getStats() {
        long totalUsers = userRepository.count();
        long totalRooms = roomRepository.count();
        long availableRooms = roomRepository.findAll().stream().filter(r -> r.isAvailability()).count();
        long occupiedRooms = totalRooms - availableRooms;
        long totalReservations = reservationRepository.count();
        
        long pendingRes = reservationRepository.findAll().stream().filter(r -> r.getStatus() == ReservationStatus.PENDING).count();
        long confirmedRes = reservationRepository.findAll().stream().filter(r -> r.getStatus() == ReservationStatus.CONFIRMED).count();
        long cancelledRes = reservationRepository.findAll().stream().filter(r -> r.getStatus() == ReservationStatus.CANCELLED).count();

        StatsResponse stats = new StatsResponse(
                totalUsers, totalRooms, availableRooms, occupiedRooms,
                totalReservations, pendingRes, confirmedRes, cancelledRes
        );
        return ResponseEntity.ok(stats);
    }

    // USER MANAGEMENT
    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }

    // ROOM MANAGEMENT
    @PostMapping("/rooms")
    public ResponseEntity<RoomResponse> createRoom(@Valid @RequestBody RoomRequest request) {
        return ResponseEntity.ok(roomService.createRoom(request));
    }

    @PutMapping("/rooms/{id}")
    public ResponseEntity<RoomResponse> updateRoom(@PathVariable Long id, @Valid @RequestBody RoomRequest request) {
        return ResponseEntity.ok(roomService.updateRoom(id, request));
    }

    @DeleteMapping("/rooms/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.ok().build();
    }

    // RESERVATION MANAGEMENT
    @GetMapping("/reservations")
    public ResponseEntity<List<ReservationResponse>> getAllReservations() {
        return ResponseEntity.ok(reservationService.getAllReservations());
    }

    @PutMapping("/reservations/{id}/status")
    public ResponseEntity<ReservationResponse> updateReservationStatus(
            @PathVariable Long id, @RequestParam ReservationStatus status) {
        return ResponseEntity.ok(reservationService.updateReservationStatus(id, status));
    }
}
