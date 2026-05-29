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
                user.getEmail());
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
}