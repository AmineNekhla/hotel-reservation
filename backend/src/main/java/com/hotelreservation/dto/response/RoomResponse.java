package com.hotelreservation.dto.response;

public class RoomResponse {

    private Long id;
    private String roomNumber;
    private String type;
    private String description;
    private double price;
    private int capacity;
    private boolean availability;
    private String imageUrl;

    public RoomResponse(Long id, String roomNumber, String type, String description,
                        double price, int capacity, boolean availability, String imageUrl) {
        this.id = id;
        this.roomNumber = roomNumber;
        this.type = type;
        this.description = description;
        this.price = price;
        this.capacity = capacity;
        this.availability = availability;
        this.imageUrl = imageUrl;
    }

    public Long getId() { return id; }
    public String getRoomNumber() { return roomNumber; }
    public String getType() { return type; }
    public String getDescription() { return description; }
    public double getPrice() { return price; }
    public int getCapacity() { return capacity; }
    public boolean isAvailability() { return availability; }
    public String getImageUrl() { return imageUrl; }
}
