package com.otoparkApp.demo.model;


import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Cascade;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "blok")
public class Blok {


    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String blok_adi;
    private long kapasite;

    @ElementCollection
    private Map<Integer, Boolean> park_alan_durum=new HashMap<>();

    @ElementCollection
    @OneToMany(mappedBy = "blok",fetch = FetchType.EAGER,cascade = CascadeType.ALL)
    private Set<Arac> arac;
}
