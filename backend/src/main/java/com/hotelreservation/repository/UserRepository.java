package com.hotelreservation.repository;

import com.hotelreservation.model.User;
import org.springFramework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User,Long> {
    User findByEmail(String email);
}