package com.otoparkApp.demo.controller;


import com.otoparkApp.demo.model.corner_model.ParkAreaData;
import com.otoparkApp.demo.service.ParkAreaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/area")
public class ParkAreaPointController {

    private final ParkAreaService service;

    public ParkAreaPointController(ParkAreaService service) {
        this.service = service;
    }

    @PostMapping("/create")
    ResponseEntity<ParkAreaData> createParkArea(@RequestBody ParkAreaData req) {
        return ResponseEntity.ok(service.createParkAreaData(req));

    }

    @GetMapping("/getAll")
    ResponseEntity<List<ParkAreaData>> getAllParkArea() {
        return ResponseEntity.ok(service.getAllParkAreaData());
    }

    @DeleteMapping("/delete/{id}")
    ResponseEntity<Void> deleteParkArea(@PathVariable Long id) {
        service.deleteParkAreaDataById(id);
        return ResponseEntity.ok().build();
    }
}
