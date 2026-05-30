package com.syncboard.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.syncboard.entity.User;
import com.syncboard.repository.UserRepository;
import com.syncboard.security.JwtUtil;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String loginUser(String email,
                            String password) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"));

        boolean matches =
                passwordEncoder.matches(
                        password,
                        user.getPassword());

        if (!matches) {

            throw new RuntimeException(
                    "Invalid password");
        }

        return JwtUtil.generateToken(
                user.getEmail(),
                user.getRole());
    }

    public User registerUser(User user) {

        if (userRepository.findByEmail(
                user.getEmail()).isPresent()) {

            throw new RuntimeException(
                    "Email already exists");
        }

        user.setPassword(
                passwordEncoder.encode(
                        user.getPassword())
        );

        return userRepository.save(user);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                    new RuntimeException(
                        "User not found"));
    }

    public User updateUserProfile(String email, User userDetails) {
        User user = getUserByEmail(email);
        
        if (userDetails.getName() != null) {
            user.setName(userDetails.getName());
        }
        if (userDetails.getEmail() != null && !userDetails.getEmail().equals(email)) {
            if (userRepository.findByEmail(userDetails.getEmail()).isPresent()) {
                throw new RuntimeException("Email already in use");
            }
            user.setEmail(userDetails.getEmail());
        }
        
        return userRepository.save(user);
    }
}