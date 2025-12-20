package ma.betteryou.betteryoubackend.service.NutritionService.ServiceImp.NutritionImp;
import ma.betteryou.betteryoubackend.repository.Nutrition.ContainsRepository;
import ma.betteryou.betteryoubackend.service.NutritionService.ContainsService;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ContainsImp implements ContainsService {
    private final ContainsRepository containsRepository;
}
