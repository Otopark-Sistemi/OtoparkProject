package com.otoparkApp.demo.model.corner_model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "park_area_data")
public class ParkAreaData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "block_name")
    private String blockName;

    @Column(name = "park_number")
    private String parkNumber;


    @OneToMany(mappedBy = "parkAreaData", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Coordinate> coordinates;


}