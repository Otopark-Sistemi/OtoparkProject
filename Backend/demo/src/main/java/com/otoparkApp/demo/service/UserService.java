package com.otoparkApp.demo.service;

import com.otoparkApp.demo.model.User;
import com.otoparkApp.demo.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public ResponseEntity<User> login(User user) {

        Optional<User> foundUser = userRepository.findByUsernameAndPassword(user.getUsername(), user.getPassword());
        if (foundUser.isPresent()) {


            return ResponseEntity.ok(foundUser.get());
        }
        return new ResponseEntity("alla allaaa bi şeyler ters gitti ne ola ki acep", HttpStatus.NOT_FOUND);
    }

    public ResponseEntity<User> register(User user) {


        user.setRole("ADMIN");
        log.info(user.getUsername());
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }
}
