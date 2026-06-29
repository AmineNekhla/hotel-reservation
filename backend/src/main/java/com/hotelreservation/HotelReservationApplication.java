package com.hotelreservation;

import com.hotelreservation.model.Room;
import com.hotelreservation.model.User;
import com.hotelreservation.repository.RoomRepository;
import com.hotelreservation.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class HotelReservationApplication {

    public static void main(String[] args) {
        SpringApplication.run(HotelReservationApplication.class, args);
    }

    @Bean
    public CommandLineRunner seedData(RoomRepository roomRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Seed rooms only if table is empty
            if (roomRepository.count() == 0) {
                roomRepository.save(createRoom("101", "Single", "Cozy room for solo travelers.", 50.0, 1, "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"));
                roomRepository.save(createRoom("102", "Double", "Spacious room with a queen bed.", 80.0, 2, "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"));
                roomRepository.save(createRoom("201", "Suite", "Luxury suite with a living area and ocean view.", 150.0, 4, "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"));
                roomRepository.save(createRoom("202", "Deluxe", "Premium room with upgraded amenities.", 120.0, 2, "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"));
                roomRepository.save(createRoom("301", "Family", "Large room with multiple beds, perfect for families.", 100.0, 5, "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"));
                System.out.println("✅ Sample rooms seeded.");
            }

            // Seed admin user only if not exists
            if (userRepository.findByEmail("admin@hotel.com").isEmpty()) {
                User admin = new User();
                admin.setName("Admin");
                admin.setEmail("admin@hotel.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole("ADMIN");
                userRepository.save(admin);
                System.out.println("✅ Admin user seeded: admin@hotel.com / admin123");
            }
        };
    }

    private Room createRoom(String roomNumber, String type, String description, double price, int capacity, String imageUrl) {
        Room room = new Room();
        room.setRoomNumber(roomNumber);
        room.setType(type);
        room.setDescription(description);
        room.setPrice(price);
        room.setCapacity(capacity);
        room.setAvailability(true);
        room.setImageUrl(imageUrl);
        return room;
    }
}
