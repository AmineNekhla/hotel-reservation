package com.hotelreservation.repository;

import com.hotelreservation.model.repository;
import org.springFramework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservarion,Long> {
    List<Reservation> findByUserId(Long userId);
}