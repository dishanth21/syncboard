package com.syncboard.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/user")
public class UserController {

    @GetMapping("/profile")
    public String profile() {

        return "Protected User Profile";

    }
    @GetMapping("/admin")

public String adminOnly() {

    return "Admin Access Granted";

}
}