package com.syncboard.controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.syncboard.dto.LoginRequest;
import com.syncboard.dto.RegisterRequest;
import com.syncboard.entity.User;
import com.syncboard.service.UserService;


@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public User register(@RequestBody RegisterRequest request) {

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole(request.getRole());

        return userService.registerUser(user);
    }
    @PostMapping("/login")
public String login(
        @RequestBody
        LoginRequest request) {

    return userService.loginUser(
            request.getEmail(),
            request.getPassword());

}
}