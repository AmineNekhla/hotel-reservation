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

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    // CREATE (authenticated user)
    @PostMapping
    public ResponseEntity<ReservationResponse> createReservation(@Valid @RequestBody ReservationRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return ResponseEntity.ok(reservationService.createReservation(request, email));
    }

    // READ MY RESERVATIONS
    @GetMapping("/my")
    public ResponseEntity<List<ReservationResponse>> getMyReservations() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        // We need userId, but we can get reservations by email in service or controller.
        // I will add a service method if needed. Let's just use email since service has it or will have it.
        // Wait, ReservationService.getReservationsByUserId takes userId. I will add getReservationsByUserEmail to service below.
        // Or fetch user by email here. Let's fetch user by email via service or modify service.
        // We'll fix this in a moment. Let's just leave it calling a new method we'll add to service.
        return ResponseEntity.ok(reservationService.getReservationsByUserEmail(email));
    }

    // READ BY ID
    @GetMapping("/{id}")
    public ResponseEntity<ReservationResponse> getReservationById(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.getReservationById(id));
    }

    // CANCEL
    @DeleteMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelReservation(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        reservationService.cancelReservation(id, email);
        return ResponseEntity.ok().build();
    }
}