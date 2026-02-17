package com.copconnect.config;

import com.copconnect.entity.Wanted;
import com.copconnect.repository.WantedRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initWanted(WantedRepository wantedRepository) {
        return args -> {
            if (wantedRepository.count() == 0) {
                Wanted w1 = new Wanted();
                w1.setName("Vicky 'The Ghost' Malhotra");
                w1.setReward("₹2,50,000");
                w1.setDescription(
                        "Wanted for series of high-profile cyber heists and digital espionage. Extremely elusive.");
                w1.setImage("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200");
                w1.setStatus("ACTIVE");
                wantedRepository.save(w1);

                Wanted w2 = new Wanted();
                w2.setName("Sonia Verma");
                w2.setReward("₹1,00,000");
                w2.setDescription("Suspected in multiple counts of corporate fraud and industrial identity theft.");
                w2.setImage("https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200");
                w2.setStatus("ACTIVE");
                wantedRepository.save(w2);
            }
        };
    }
}
