package ma.betteryou.betteryoubackend.controller;

import lombok.RequiredArgsConstructor;
import ma.betteryou.betteryoubackend.dto.Profile.UserObjectiveDto;
import ma.betteryou.betteryoubackend.dto.Profile.UserProfileInfoDto;
import ma.betteryou.betteryoubackend.dto.Profile.UserProfileResponseDto;
import ma.betteryou.betteryoubackend.entity.user.User;
import ma.betteryou.betteryoubackend.repository.UserRepository;
import ma.betteryou.betteryoubackend.service.profile.UserProfileService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;
    private final UserRepository userRepository;

    private Long getCurrentUserId(Authentication authentication) {
        String email = authentication.getName(); //  récupéré depuis le token
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
        return user.getIdUser(); // ⚠️ adapte si ton champ ID a un autre nom
    }

    @GetMapping
    public UserProfileResponseDto getProfile(Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        return userProfileService.getProfileByUserId(userId);
    }

    @PutMapping("/info")
    public UserProfileInfoDto updateInfo(@RequestBody UserProfileInfoDto dto,
                                         Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        return userProfileService.updateProfileInfo(userId, dto);
    }

    @PutMapping("/objective")
    public UserObjectiveDto updateObjective(@RequestBody UserObjectiveDto dto,
                                            Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        return userProfileService.updateObjective(userId, dto);
    }
}
