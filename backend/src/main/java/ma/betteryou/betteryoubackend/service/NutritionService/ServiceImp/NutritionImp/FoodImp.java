package ma.betteryou.betteryoubackend.service.NutritionService.ServiceImp.NutritionImp;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import ma.betteryou.betteryoubackend.repository.Nutrition.FoodRepository;
import ma.betteryou.betteryoubackend.service.NutritionService.FoodService;

@Service
@RequiredArgsConstructor

public class FoodImp implements FoodService{
    private final FoodRepository foodRepository;
}
