package com.otoparkApp.demo.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Entity
@Getter
@Setter
@Table(name = "arac")
public class Arac implements Serializable {

    @Id
    private Long id;
    @JsonIgnore
    @ManyToOne(cascade = CascadeType.ALL)
    private Blok blok;
    private String plaka;
    private String giris;
    private String cikis;
    private long park_alani;

}
