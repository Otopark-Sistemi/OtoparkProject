package com.otoparkApp.demo.model.corner_model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "coordinate")
@Getter
@Setter
public class Coordinate {

    @JsonIgnore
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(cascade = CascadeType.ALL,fetch = FetchType.EAGER)
    @JsonIgnore
    private ParkAreaData parkAreaData;

    @Column(name = "x")
    private int x;

    @Column(name = "y")
    private int y;

    // getters and setters
}