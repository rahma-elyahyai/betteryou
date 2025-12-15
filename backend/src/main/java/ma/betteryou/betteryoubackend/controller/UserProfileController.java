package ma.betteryou.betteryoubackend.controller;

import lombok.RequiredArgsConstructor;
import ma.betteryou.betteryoubackend.dto.*;
import ma.betteryou.betteryoubackend.service.UserProfileService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;

    // Pour l’instant : user fixe tant qu’on n’a pas l’auth
    private static final Long DEMO_USER_ID = 1L;

    @GetMapping
    public UserProfileResponseDto getProfile() {
        return userProfileService.getProfileByUserId(DEMO_USER_ID);
    }

    @PutMapping("/info")
    public UserProfileInfoDto updateInfo(@RequestBody UserProfileInfoDto dto) {
        Long userId = 1L;
        return userProfileService.updateProfileInfo(userId, dto);
    }

    @PutMapping("/objective")
    public UserObjectiveDto updateObjective(@RequestBody UserObjectiveDto dto) {
        Long userId = 1L;
        return userProfileService.updateObjective(userId, dto);
    }
}
