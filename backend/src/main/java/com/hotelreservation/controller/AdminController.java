package com.hotelreservation.controller;

import com.hotelreservation.dto.request.RoomRequest;
import com.hotelreservation.dto.response.ReservationResponse;
import com.hotelreservation.dto.response.RoomResponse;
import com.hotelreservation.dto.response.StatsResponse;
import com.hotelreservation.dto.response.UserResponse;
import com.hotelreservation.model.ReservationStatus;
import com.hotelreservation.service.AdminService;
import com.hotelreservation.service.ReservationService;
import com.hotelreservation.service.RoomService;
import com.hotelreservation.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller exposing admin-only endpoints for managing users, rooms,
 * reservations, and dashboard statistics.
 * <p>
 * All routes under {@code /api/admin} are protected by {@code ROLE_ADMIN}
 * in the Spring Security configuration.
 * </p>
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final UserService userService;
    private final RoomService roomService;
    private final ReservationService reservationService;

    public AdminController(AdminService adminService,
                           UserService userService,
                           RoomService roomService,
                           ReservationService reservationService) {
        this.adminService = adminService;
        this.userService = userService;
        this.roomService = roomService;
        this.reservationService = reservationService;
    }

    // ─── Dashboard ─────────────────────────────────────────────────────────────

    /**
     * Returns aggregated real-time statistics for the admin dashboard.
     *
     * @return {@link StatsResponse} with user, room, and reservation counts
     */
    @GetMapping("/stats")
    public ResponseEntity<StatsResponse> getStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    // ─── User Management ───────────────────────────────────────────────────────

    /**
     * Retrieves all registered users.
     *
     * @return list of all users as {@link UserResponse}
     */
    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    /**
     * Permanently deletes a user by ID.
     *
     * @param id the ID of the user to delete
     * @return 204 No Content on success
     */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // ─── Room Management ───────────────────────────────────────────────────────

    /**
     * Creates a new hotel room.
     *
     * @param request validated room creation payload
     * @return the created room as {@link RoomResponse}
     */
    @PostMapping("/rooms")
    public ResponseEntity<RoomResponse> createRoom(@Valid @RequestBody RoomRequest request) {
        return ResponseEntity.ok(roomService.createRoom(request));
    }

    /**
     * Updates an existing room's details.
     *
     * @param id      the ID of the room to update
     * @param request validated room update payload
     * @return the updated room as {@link RoomResponse}
     */
    @PutMapping("/rooms/{id}")
    public ResponseEntity<RoomResponse> updateRoom(@PathVariable Long id,
                                                    @Valid @RequestBody RoomRequest request) {
        return ResponseEntity.ok(roomService.updateRoom(id, request));
    }

    /**
     * Deletes a room by ID.
     *
     * @param id the ID of the room to delete
     * @return 204 No Content on success
     */
    @DeleteMapping("/rooms/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }

    // ─── Reservation Management ────────────────────────────────────────────────

    /**
     * Retrieves all reservations across all users.
     *
     * @return list of all reservations as {@link ReservationResponse}
     */
    @GetMapping("/reservations")
    public ResponseEntity<List<ReservationResponse>> getAllReservations() {
        return ResponseEntity.ok(reservationService.getAllReservations());
    }

    /**
     * Updates the status of a reservation (e.g., PENDING → CONFIRMED or CANCELLED).
     *
     * @param id     the ID of the reservation to update
     * @param status the new {@link ReservationStatus}
     * @return the updated reservation as {@link ReservationResponse}
     */
    @PutMapping("/reservations/{id}/status")
    public ResponseEntity<ReservationResponse> updateReservationStatus(
            @PathVariable Long id,
            @RequestParam ReservationStatus status) {
        return ResponseEntity.ok(reservationService.updateReservationStatus(id, status));
    }
}
