package com.hotelreservation.dto.response;

import com.hotelreservation.model.ReservationStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ReservationResponse {

    private Long id;
    private UserResponse user;
    private RoomResponse room;
    private LocalDate startDate;
    private LocalDate endDate;
    private ReservationStatus status;
    private LocalDateTime createdAt;

    public ReservationResponse(Long id, UserResponse user, RoomResponse room,
                               LocalDate startDate, LocalDate endDate,
                               ReservationStatus status, LocalDateTime createdAt) {
        this.id = id;
        this.user = user;
        this.room = room;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public UserResponse getUser() { return user; }
    public RoomResponse getRoom() { return room; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getEndDate() { return endDate; }
    public ReservationStatus getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
