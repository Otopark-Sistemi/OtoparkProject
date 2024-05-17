package com.otoparkApp.demo.repository;

import com.otoparkApp.demo.model.corner_model.ParkAreaData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ParkAreaRepository extends JpaRepository<ParkAreaData,Long> {

    @Query("SELECT pad FROM ParkAreaData pad LEFT JOIN FETCH pad.coordinates")
    List<ParkAreaData> findAllWithCoordinates();
}
