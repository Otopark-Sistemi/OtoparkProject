package com.otoparkApp.demo.service;


import com.otoparkApp.demo.model.corner_model.Coordinate;
import com.otoparkApp.demo.model.corner_model.ParkAreaData;
import com.otoparkApp.demo.repository.ParkAreaRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class ParkAreaService {


    private final ParkAreaRepository parkAreaRepository;

    public ParkAreaService(ParkAreaRepository parkAreaRepository) {
        this.parkAreaRepository = parkAreaRepository;
    }


    public ParkAreaData createParkAreaData(ParkAreaData data) {
        log.info("CREATE PARK DATA TRIGGERED");

        if (data.getCoordinates() != null) {
            for (Coordinate coordinate : data.getCoordinates()) {
                coordinate.setParkAreaData(data);  // Coordinate nesnelerinin parkAreaData alanını ayarlıyoruz
            }
        }
        System.out.println(data.getBlockName());
        System.out.println(data.getParkNumber());
        System.out.println(data.getCoordinates().get(0).getX() + " " + data.getCoordinates().get(1).getX() + " " + data.getCoordinates().get(2).getX() + " " + data.getCoordinates().get(3).getX());
        System.out.println(data.getCoordinates().get(0).getY() + " " + data.getCoordinates().get(1).getY() + " " + data.getCoordinates().get(2).getY() + " " + data.getCoordinates().get(3).getY());
        return parkAreaRepository.save(data);
    }


    public List<ParkAreaData> getAllParkAreaData() {
        log.info("GET PARK DATA TRIGGERED");
        return parkAreaRepository.findAllWithCoordinates();
    }


    public void deleteParkAreaDataById(Long id) {
        log.info("DELETE PARK DATA TRIGGERED");
        parkAreaRepository.deleteById(id);
    }


}
