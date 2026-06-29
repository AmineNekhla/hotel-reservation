package com.hotelreservation.controller;

import com.hotelreservation.model.Reservation;
import com.hotelreservation.model.Room;
import com.hotelreservation.model.User;
import com.hotelreservation.service.ReservationService;
import com.hotelreservation.service.RoomService;
import com.hotelreservation.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private UserService userService;

    @Autowired
    private RoomService roomService;

    // CREATE — accepts { userId, roomId, startDate, endDate }
    @PostMapping
    public ResponseEntity<?> createReservation(@RequestBody Map<String, Object> body) {
        try {
            Long userId = Long.valueOf(body.get("userId").toString());
            Long roomId = Long.valueOf(body.get("roomId").toString());
            LocalDate startDate = LocalDate.parse(body.get("startDate").toString());
            LocalDate endDate = LocalDate.parse(body.get("endDate").toString());

            User user = userService.getUserById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Room room = roomService.getRoomById(roomId)
                    .orElseThrow(() -> new RuntimeException("Room not found"));

            if (!room.isAvailability()) {
                return ResponseEntity.badRequest().body("Room is not available");
            }

            // Mark room as unavailable
            room.setAvailability(false);
            roomService.saveRoom(room);

            // Build and save the reservation
            Reservation reservation = new Reservation();
            reservation.setUser(user);
            reservation.setRoom(room);
            reservation.setStartDate(startDate);
            reservation.setEndDate(endDate);
            reservation.setStatus("BOOKED");

            return ResponseEntity.ok(reservationService.saveReservation(reservation));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating reservation: " + e.getMessage());
        }
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