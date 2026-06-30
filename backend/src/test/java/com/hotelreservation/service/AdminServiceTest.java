package com.hotelreservation.service;

import com.hotelreservation.dto.response.StatsResponse;
import com.hotelreservation.model.ReservationStatus;
import com.hotelreservation.repository.ReservationRepository;
import com.hotelreservation.repository.RoomRepository;
import com.hotelreservation.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminServiceTest {

    @Mock
    private UserRepository userRepository;
    
    @Mock
    private RoomRepository roomRepository;
    
    @Mock
    private ReservationRepository reservationRepository;

    @InjectMocks
    private AdminService adminService;

    @Test
    void getDashboardStats_calculatesOccupancyCorrectly() {
        // Setup
        when(userRepository.count()).thenReturn(10L);
        when(roomRepository.count()).thenReturn(20L); // 20 Total Rooms
        
        // 5 rooms are occupied today
        when(reservationRepository.countOccupiedRoomsOnDate(any(LocalDate.class), eq(ReservationStatus.CONFIRMED)))
                .thenReturn(5L);
                
        when(reservationRepository.count()).thenReturn(50L);
        when(reservationRepository.countByStatus(ReservationStatus.PENDING)).thenReturn(5L);
        when(reservationRepository.countByStatus(ReservationStatus.CONFIRMED)).thenReturn(40L);
        when(reservationRepository.countByStatus(ReservationStatus.CANCELLED)).thenReturn(5L);

        // Execute
        StatsResponse stats = adminService.getDashboardStats();

        // Verify
        assertThat(stats.getTotalRooms()).isEqualTo(20L);
        assertThat(stats.getOccupiedRooms()).isEqualTo(5L);
        assertThat(stats.getAvailableRooms()).isEqualTo(15L); // 20 - 5
        assertThat(stats.getTotalReservations()).isEqualTo(50L);
    }
}
