package com.hotelreservation.service;

import com.hotelreservation.model.User;
import com.hotelreservation.repository.UserRepository;
import org.springFramework.beans.factory.annotation.Autowired;
import org.springFramework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }
     public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}