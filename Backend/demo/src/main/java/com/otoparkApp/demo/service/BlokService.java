package com.otoparkApp.demo.service;


import com.otoparkApp.demo.model.Arac;
import com.otoparkApp.demo.model.Blok;
import com.otoparkApp.demo.repository.BlokRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

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

       Set<Arac>aracList=new HashSet<>();



        for (int i = 0; i < blok_size; i++) {
            park_durum_list.put(i + 1, false);
        }

        blok.setArac(aracList);


        try {

            log.info("BLOK OLUŞTURULDU.");
            blokRepository.save(blok);
        } catch (Exception e) {
            log.error("Blok oluşturulamadı. Hata: " + e.getMessage());
        }

        return blok;
    }


    public List<Blok> getAllBlok() {

        log.info("GET ALL FONKSİYONUNA GİRDİ");
        return blokRepository.findAll();
    }

}
