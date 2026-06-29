package com.hotelreservation.controller;

import com.hotelreservation.model.Reservation;
import com.hotelreservation.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    // CREATE
    @PostMapping
    public Reservation createReservation(@RequestBody Reservation reservation) {
        return reservationService.saveReservation(reservation);
    }

    // READ ALL
    @GetMapping
    public List<Reservation> getAllReservations() {
        return reservationService.getAllReservations();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getReservationById(@PathVariable Long id) {
        return reservationService.getReservationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // READ BY USER ID
    @GetMapping("/user/{userId}")
    public List<Reservation> getReservationsByUser(@PathVariable Long userId) {
        return reservationService.getReservationsByUserId(userId);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Reservation> updateReservation(@PathVariable Long id, @RequestBody Reservation updatedReservation) {
        return reservationService.getReservationById(id)
                .map(reservation -> {
                    reservation.setStartDate(updatedReservation.getStartDate());
                    reservation.setEndDate(updatedReservation.getEndDate());
                    reservation.setStatus(updatedReservation.getStatus());
                    reservation.setUser(updatedReservation.getUser());
                    reservation.setRoom(updatedReservation.getRoom());
                    return ResponseEntity.ok(reservationService.saveReservation(reservation));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
        if (reservationService.getReservationById(id).isPresent()) {
            reservationService.deleteReservation(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}