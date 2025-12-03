package ma.betteryou.betteryoubackend.controller;

import lombok.RequiredArgsConstructor;
import ma.betteryou.betteryoubackend.entity.UserProfile;
import ma.betteryou.betteryoubackend.service.UserProfileService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profiles")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService service;

    @PostMapping
    public UserProfile create(@RequestBody UserProfile profile) {
        return service.create(profile);
    }

    @GetMapping
    public List<UserProfile> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public UserProfile getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
