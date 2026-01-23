package ma.betteryou.betteryoubackend.controller.dashboard;

import lombok.RequiredArgsConstructor;
import ma.betteryou.betteryoubackend.dto.dashboard.DashboardResponse;
import ma.betteryou.betteryoubackend.service.dashboard.DashboardService;
import org.springframework.web.bind.annotation.*;

@RestController  //renvoie des données JSON
@RequestMapping("/api/dashboard")   //Chaque API dans cette classe commencera par
@RequiredArgsConstructor   //Génère automatiquement un constructeur avec toutes les variables final de la classe
public class DashboardController {

    // Injecté automatiquement par Spring (grâce à @RequiredArgsConstructor)
    private final DashboardService dashboardService;

    
    @GetMapping("/{userId}")
    public DashboardResponse getDashboard(@PathVariable Integer userId) {    //récupère {userId} depuis l’URL.
        return dashboardService.getDashboardForUser(userId);
    }
}