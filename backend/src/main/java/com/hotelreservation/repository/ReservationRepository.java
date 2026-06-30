package com.hotelreservation.repository;

import com.hotelreservation.model.Reservation;
import com.hotelreservation.model.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    /** Finds all reservations belonging to a given user. */
    List<Reservation> findByUserId(Long userId);

    /** Counts reservations with the given status using a derived query. */
    long countByStatus(ReservationStatus status);

    /**
     * Checks whether a confirmed reservation already overlaps with the requested date range.
     * Uses a half-open interval: [startDate, endDate) to detect true overlaps.
     */
    @Query("SELECT COUNT(r) > 0 FROM Reservation r " +
           "WHERE r.room.id = :roomId " +
           "AND r.status = :status " +
           "AND r.startDate < :endDate AND r.endDate > :startDate")
    boolean hasOverlappingReservation(
            @Param("roomId") Long roomId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("status") ReservationStatus status
    );
}