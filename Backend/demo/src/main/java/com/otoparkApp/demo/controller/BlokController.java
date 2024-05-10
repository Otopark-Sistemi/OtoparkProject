package com.otoparkApp.demo.controller;


import com.otoparkApp.demo.model.Blok;
import com.otoparkApp.demo.service.BlokService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/blok")
public class BlokController {


    private final BlokService service;

    public BlokController(BlokService service) {
        this.service = service;
    }

    @PostMapping("/create")
    public ResponseEntity<Blok> createBlok(@RequestBody Blok blok) {
        return ResponseEntity.ok(service.createBlok(blok));
    }


    @GetMapping("/getAll")
    public ResponseEntity<List<Blok>> getAllBlok(){

        return ResponseEntity.ok(service.getAllBlok());
    }
}
