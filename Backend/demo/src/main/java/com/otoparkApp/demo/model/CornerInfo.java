package com.otoparkApp.demo.model;


import jakarta.persistence.ElementCollection;
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
    private Long id;

    private String block_name;

    @ElementCollection
    private List<String> corner_number_list;


}
