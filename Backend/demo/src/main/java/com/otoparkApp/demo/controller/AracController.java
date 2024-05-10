package com.otoparkApp.demo.controller;


import com.otoparkApp.demo.model.Arac;
import com.otoparkApp.demo.service.AracService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/arac")
public class AracController {

    private final AracService service;

    public AracController(AracService service) {
        this.service = service;
    }

    @PostMapping("/create/{id}")
    public ResponseEntity<String> createArac(@RequestBody Arac arac, @PathVariable Long id) {
        return service.createArac(arac, id);
    }


    @DeleteMapping("/delete/{id}")
    public void unpark(@PathVariable Long id) {

        service.unpark(id);
    }
}
