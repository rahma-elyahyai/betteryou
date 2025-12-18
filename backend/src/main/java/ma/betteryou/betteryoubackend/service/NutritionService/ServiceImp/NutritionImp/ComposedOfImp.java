package ma.betteryou.betteryoubackend.service.NutritionService.ServiceImp.NutritionImp;
import ma.betteryou.betteryoubackend.repository.Nutrition.ComposedOfRepository;
import ma.betteryou.betteryoubackend.service.NutritionService.ComposedOfService;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ComposedOfImp implements ComposedOfService {

    private final ComposedOfRepository composedOfRepository;

}
