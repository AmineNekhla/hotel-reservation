package com.hotelreservation.service;

import com.hotelreservation.model.Reservation;
import com.hotelreservation.repository.ReservationRepository;
import org.springFramework.beans.factory.annotation.Autowired;
import org.springFramework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReservationService {
    @Autowired
    private ReservationRepository reservationRepository;

    public List<Reservation> getAllReservations(){
        return reservationRepository.find();
    }

    public Optional<Reservation> getReservationById(Long id) {
        return reservationRepository.findById(id);
    }

    public List<Reservation> getReservationByUserId(Lond userId){
        return reservationRepository.findByUserId(userId);
    }

    public Reservation saveReservation(Reservation Reservation) {
        return reservationRepository.save(Reservation);
    }

    public void deleteReservation(Long id) {
        reservationRepository.deleteById(id);
    }
}