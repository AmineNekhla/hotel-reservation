package com.hotelreservation.dto.response;

public class StatsResponse {

    private long totalUsers;
    private long totalRooms;
    private long availableRooms;
    private long occupiedRooms;
    private long totalReservations;
    private long pendingReservations;
    private long confirmedReservations;
    private long cancelledReservations;

    public StatsResponse(long totalUsers, long totalRooms, long availableRooms,
                         long occupiedRooms, long totalReservations,
                         long pendingReservations, long confirmedReservations,
                         long cancelledReservations) {
        this.totalUsers = totalUsers;
        this.totalRooms = totalRooms;
        this.availableRooms = availableRooms;
        this.occupiedRooms = occupiedRooms;
        this.totalReservations = totalReservations;
        this.pendingReservations = pendingReservations;
        this.confirmedReservations = confirmedReservations;
        this.cancelledReservations = cancelledReservations;
    }

    public long getTotalUsers() { return totalUsers; }
    public long getTotalRooms() { return totalRooms; }
    public long getAvailableRooms() { return availableRooms; }
    public long getOccupiedRooms() { return occupiedRooms; }
    public long getTotalReservations() { return totalReservations; }
    public long getPendingReservations() { return pendingReservations; }
    public long getConfirmedReservations() { return confirmedReservations; }
    public long getCancelledReservations() { return cancelledReservations; }
}
