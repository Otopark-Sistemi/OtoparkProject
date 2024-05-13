package com.otoparkApp.demo.controller;


import com.otoparkApp.demo.model.User;
import com.otoparkApp.demo.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController {


    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody User user) {
        return userService.login(user);
    }


    @PostMapping("/signup")
    public ResponseEntity<User> register(@RequestBody User user) {
        return userService.register(user);
    }


}
