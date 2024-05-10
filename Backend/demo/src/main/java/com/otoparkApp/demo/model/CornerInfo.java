package com.otoparkApp.demo.model;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Entity
@Getter
@Setter
public class CornerInfo {


    @Id
    private long id;

    private String block_name;


}
