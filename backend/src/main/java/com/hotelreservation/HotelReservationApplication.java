package com.hotelreservation;

import com.hotelreservation.model.Room;
import com.hotelreservation.model.User;
import com.hotelreservation.repository.RoomRepository;
import com.hotelreservation.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class HotelReservationApplication {

    public static void main(String[] args) {
        SpringApplication.run(HotelReservationApplication.class, args);
    }

    @Bean
    public CommandLineRunner seedData(RoomRepository roomRepository, UserRepository userRepository) {
        return args -> {
            // Seed rooms only if table is empty
            if (roomRepository.count() == 0) {
                roomRepository.save(createRoom("Single", 50.0, 1));
                roomRepository.save(createRoom("Double", 80.0, 2));
                roomRepository.save(createRoom("Suite", 150.0, 4));
                roomRepository.save(createRoom("Deluxe", 120.0, 2));
                roomRepository.save(createRoom("Family", 100.0, 5));
                System.out.println("✅ Sample rooms seeded.");
            }

            // Seed admin user only if not exists
            if (userRepository.findByEmail("admin@hotel.com") == null) {
                User admin = new User();
                admin.setName("Admin");
                admin.setEmail("admin@hotel.com");
                admin.setPassword("admin123");
                admin.setRole("ADMIN");
                userRepository.save(admin);
                System.out.println("✅ Admin user seeded: admin@hotel.com / admin123");
            }
        };
    }

    private Room createRoom(String type, double price, int capacity) {
        Room room = new Room();
        room.setType(type);
        room.setPrice(price);
        room.setCapacity(capacity);
        room.setAvailability(true);
        return room;
    }
}
