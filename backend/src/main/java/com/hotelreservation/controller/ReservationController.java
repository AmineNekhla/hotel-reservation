package com.hotelreservation.controller;

import com.hotelreservation.dto.request.ReservationRequest;
import com.hotelreservation.dto.response.ReservationResponse;
import com.hotelreservation.service.ReservationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for reservation operations performed by authenticated users.
 * <p>
 * Users can create reservations, view their own bookings, and cancel them.
 * Admin-level reservation management is handled separately in {@link AdminController}.
 * </p>
 */
@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    /**
     * Creates a new reservation for the currently authenticated user.
     *
     * @param request validated reservation creation payload
     * @return the created reservation as {@link ReservationResponse}
     */
    @PostMapping
    public ResponseEntity<ReservationResponse> createReservation(@Valid @RequestBody ReservationRequest request) {
        String email = getAuthenticatedUserEmail();
        return ResponseEntity.ok(reservationService.createReservation(request, email));
    }

    /**
     * Retrieves all reservations belonging to the currently authenticated user.
     *
     * @return list of the user's reservations
     */
    @GetMapping("/my")
    public ResponseEntity<List<ReservationResponse>> getMyReservations() {
        String email = getAuthenticatedUserEmail();
        return ResponseEntity.ok(reservationService.getReservationsByUserEmail(email));
    }

    /**
     * Retrieves a single reservation by its ID.
     *
     * @param id the reservation ID
     * @return the matching reservation
     */
    @GetMapping("/{id}")
    public ResponseEntity<ReservationResponse> getReservationById(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.getReservationById(id));
    }

    /**
     * Cancels a reservation. Only the reservation owner or an admin can cancel.
     *
     * @param id the ID of the reservation to cancel
     * @return 204 No Content on success
     */
    @DeleteMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelReservation(@PathVariable Long id) {
        String email = getAuthenticatedUserEmail();
        reservationService.cancelReservation(id, email);
        return ResponseEntity.noContent().build();
    }

    // ─── Private Helpers ───────────────────────────────────────────────────────

    private String getAuthenticatedUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
}