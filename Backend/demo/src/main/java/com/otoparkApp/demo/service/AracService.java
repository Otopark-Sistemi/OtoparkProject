package com.otoparkApp.demo.service;


import com.otoparkApp.demo.model.Arac;
import com.otoparkApp.demo.model.Blok;
import com.otoparkApp.demo.repository.AracRepository;
import com.otoparkApp.demo.repository.BlokRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
public class AracService {



    private final AracRepository aracRepository;
    private final BlokRepository blokRepository;

    public AracService(AracRepository aracRepository, BlokRepository blokRepository) {
        this.aracRepository = aracRepository;
        this.blokRepository = blokRepository;
    }

    public ResponseEntity<String> createArac(Arac arac, Long blok_id) {

        Optional<Arac> foundArac = aracRepository.findById(arac.getId());
        if (foundArac.isPresent()) {

            return ResponseEntity.badRequest().body("Arac zaten mevcut");
        }


        Blok blok = blokRepository.findById(blok_id).get();
        arac.setBlok(blok);


        if (blok.getKapasite() != 0) {

            Boolean durum = blok.getPark_alan_durum().get((int)arac.getPark_alani()).booleanValue();
            if (durum) {
                log.info("ARAÇ MEVCUT");
                return ResponseEntity.badRequest().body("Bu alanda araç zaten mevcut lütfen başka alan seçin...");
            }
            durum = true;
            blok.getPark_alan_durum().put((int) arac.getPark_alani(), durum);
            blok.setKapasite(blok.getKapasite() - 1);
            blokRepository.save(blok);
        } else {
            log.error("Blok kapasitesi dolu");
            return ResponseEntity.badRequest().body("Blok dolu");
        }

        log.info("ARAÇ EKLENDİ");

        return ResponseEntity.ok("Arac eklendi" + aracRepository.save(arac));


    }


    //TODO bunu bitir
    public void unpark(Long id) {


        Optional<Arac> foundArac = aracRepository.findById(id);
        if (foundArac.isPresent()) {
            foundArac.get().getBlok().setKapasite(foundArac.get().getBlok().getKapasite() + 1);
            foundArac.get().getBlok().getPark_alan_durum().put((int) foundArac.get().getPark_alani(), false);

            aracRepository.delete(foundArac.get());

            log.info("Deleted");
        }


    }
}
