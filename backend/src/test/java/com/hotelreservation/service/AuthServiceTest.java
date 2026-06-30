package com.hotelreservation.service;

import com.hotelreservation.dto.request.RegisterRequest;
import com.hotelreservation.exception.ConflictException;
import com.hotelreservation.model.User;
import com.hotelreservation.repository.UserRepository;
import com.hotelreservation.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for {@link AuthService}.
 */
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtUtil jwtUtil;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private UserDetailsService userDetailsService;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setName("Alice");
        registerRequest.setEmail("alice@example.com");
        registerRequest.setPassword("securePass123");
    }

    @Test
    @DisplayName("register should throw ConflictException when email is already in use")
    void register_duplicateEmail_throwsConflict() {
        User existingUser = new User();
        existingUser.setEmail("alice@example.com");
        when(userRepository.findByEmail("alice@example.com")).thenReturn(Optional.of(existingUser));

        assertThatThrownBy(() -> authService.register(registerRequest))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("Email already in use");
    }

    @Test
    @DisplayName("register should encode the password before persisting")
    void register_newUser_encodesPassword() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode("securePass123")).thenReturn("encoded-hash");

        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setName("Alice");
        savedUser.setEmail("alice@example.com");
        savedUser.setPassword("encoded-hash");
        savedUser.setRole("USER");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        UserDetails mockDetails = mock(UserDetails.class);
        when(userDetailsService.loadUserByUsername(anyString())).thenReturn(mockDetails);
        when(jwtUtil.generateToken(mockDetails)).thenReturn("mocked-jwt-token");

        var response = authService.register(registerRequest);

        assertThat(response.getToken()).isEqualTo("mocked-jwt-token");
        assertThat(response.getEmail()).isEqualTo("alice@example.com");
        assertThat(response.getRole()).isEqualTo("USER");
        verify(passwordEncoder).encode("securePass123");
    }

    @Test
    @DisplayName("register should assign USER role by default")
    void register_newUser_assignsUserRole() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("hash");

        User savedUser = new User();
        savedUser.setId(2L);
        savedUser.setRole("USER");
        savedUser.setEmail("alice@example.com");
        savedUser.setName("Alice");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        UserDetails mockDetails = mock(UserDetails.class);
        when(userDetailsService.loadUserByUsername(anyString())).thenReturn(mockDetails);
        when(jwtUtil.generateToken(any())).thenReturn("token");

        var response = authService.register(registerRequest);

        assertThat(response.getRole()).isEqualTo("USER");
    }
}
