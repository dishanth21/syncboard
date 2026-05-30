package com.syncboard.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.syncboard.entity.User;
import com.syncboard.service.UserService;

@RestController
@RequestMapping("/api/v1/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public User getProfile() {
        Authentication auth = SecurityContextHolder
                .getContext()
                .getAuthentication();
        String email = auth.getName();
        return userService.getUserByEmail(email);
    }

    @PutMapping("/profile")
    public User updateProfile(
            @RequestBody User user) {
        Authentication auth = SecurityContextHolder
                .getContext()
                .getAuthentication();
        String email = auth.getName();
        return userService.updateUserProfile(email, user);
    }

    @GetMapping("/admin")
    public String adminOnly() {
        return "Admin Access Granted";
    }
}