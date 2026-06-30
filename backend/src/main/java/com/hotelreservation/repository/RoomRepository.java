package com.hotelreservation.repository;

import com.hotelreservation.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomRepository extends JpaRepository<Room, Long> {

    /** Counts available rooms using a derived query (no manual SQL needed). */
    long countByAvailabilityTrue();
}