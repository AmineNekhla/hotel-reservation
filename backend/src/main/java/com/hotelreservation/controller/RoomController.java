package com.hotelreservation.controller;

import com.hotelreservation.service.RoomService;
import com.hotelreservation.model.Room;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {
    @Autowired
    private RoomService roomService;

    @PostMapping
    public Room createRoom(@RequestBody Room room){
        return roomService.saveRoom(room);
    }

    @GetMapping
    public List<Room> getAllRooms() {
        return roomService.getAllRooms();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoomById(@PathVariable Long id) {
        return roomService.getRoomById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Room> updateRoom(@PathVariable Long id, @RequestBody Room updatedRoom){
        return roomService.getRoomById(id)
                .map(room -> {
                    room.setType(updatedRoom.getType());
                    room.setPrice(updatedRoom.getPrice());
                    room.setCapacity(updatedRoom.getCapacity());
                    room.setAvailability(updatedRoom.isAvailability());
                    return ResponseEntity.ok(roomService.saveRoom(room));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        if(roomService.getRoomById(id).isPresent()) {
            roomService.deleteRoom(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}