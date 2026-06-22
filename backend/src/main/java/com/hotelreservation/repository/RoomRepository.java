package com.hotelreservation.repository;

import com.hotelreservation.model.Room;
import org.springFramework.data.jpa.repository.JpaRepository;

public interface RoomRepository extends JpaRepository<Room,Long> {}