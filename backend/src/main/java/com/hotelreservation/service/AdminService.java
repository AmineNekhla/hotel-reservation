package com.hotelreservation.service;

import com.hotelreservation.dto.response.StatsResponse;
import com.hotelreservation.model.ReservationStatus;
import com.hotelreservation.repository.ReservationRepository;
import com.hotelreservation.repository.RoomRepository;
import com.hotelreservation.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service handling all admin-specific business logic and dashboard statistics.
 * <p>
 * Centralizes statistics computation with efficient database-level COUNT queries
 * rather than loading all entities into memory.
 * </p>
 */
@Service
@Transactional(readOnly = true)
public class AdminService {

    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final ReservationRepository reservationRepository;

    public AdminService(UserRepository userRepository,
                        RoomRepository roomRepository,
                        ReservationRepository reservationRepository) {
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
        this.reservationRepository = reservationRepository;
    }

    /**
     * Computes a real-time dashboard snapshot using efficient COUNT queries.
     *
     * @return {@link StatsResponse} containing aggregated metrics for the admin dashboard
     */
    public StatsResponse getDashboardStats() {
        long totalUsers          = userRepository.count();
        long totalRooms          = roomRepository.count();
        long occupiedRooms       = reservationRepository.countOccupiedRoomsOnDate(java.time.LocalDate.now(), ReservationStatus.CONFIRMED);
        long availableRooms      = totalRooms - occupiedRooms;
        long totalReservations   = reservationRepository.count();
        long pendingRes          = reservationRepository.countByStatus(ReservationStatus.PENDING);
        long confirmedRes        = reservationRepository.countByStatus(ReservationStatus.CONFIRMED);
        long cancelledRes        = reservationRepository.countByStatus(ReservationStatus.CANCELLED);

        return new StatsResponse(
                totalUsers, totalRooms, availableRooms, occupiedRooms,
                totalReservations, pendingRes, confirmedRes, cancelledRes
        );
    }
}
