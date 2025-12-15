package ma.betteryou.betteryoubackend;

import ma.betteryou.betteryoubackend.DTO.RegisterRequest;
import ma.betteryou.betteryoubackend.service.AuthService;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.time.LocalDate;
@Disabled
@SpringBootTest
public class TestAuthService {

//    @Autowired
//    private AuthService authService;
//
//    @Test
//    void testRegisterUser() {
//
//        RegisterRequest req = new RegisterRequest();
//        req.setFirstName("khadija");
//        req.setLastName("wa");
//        req.setEmail("khadija@gmail.com");
//        req.setPassword("pass123");
//        req.setGender("FEMALE");
//        req.setGoal("LOSE_WEIGHT");
//        req.setFitnessLevel("BEGINNER");
//        req.setActivityLevel("ACTIVE");
//
//        req.setBirthDate(LocalDate.of(2000, 1, 1));
//        req.setHeightCm(165);
//        req.setInitialWeightKg(new BigDecimal("70"));
//        req.setTargetWeightKg(new BigDecimal("60"));
//
//        var response = authService.register(req);
//
//        System.out.println("TOKEN = " + response.getToken());
//        System.out.println("USER ID = " + response.getUserId());
//    }
}
