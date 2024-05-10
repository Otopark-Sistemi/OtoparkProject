package com.otoparkApp.demo.service;


import com.otoparkApp.demo.model.Blok;
import com.otoparkApp.demo.repository.BlokRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@Slf4j
public class BlokService {

    private final BlokRepository blokRepository;

    public BlokService(BlokRepository blokRepository) {
        this.blokRepository = blokRepository;
    }


    public Blok createBlok(Blok blok) {

        Map<Integer, Boolean> park_durum_list = blok.getPark_alan_durum();

       long blok_size = blok.getKapasite();




        for (int i = 0; i < blok_size; i++) {
            park_durum_list.put(i + 1, false);
        }


        try {
            blokRepository.save(blok);
        } catch (Exception e) {
            log.error("Blok oluşturulamadı. Hata: " + e.getMessage());
        }

        return blok;
    }


    public List<Blok> getAllBlok() {
        return blokRepository.findAll();
    }

}
