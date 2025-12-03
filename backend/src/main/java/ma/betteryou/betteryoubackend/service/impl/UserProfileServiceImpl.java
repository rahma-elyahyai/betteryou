package ma.betteryou.betteryoubackend.service.impl;

import lombok.RequiredArgsConstructor;
import ma.betteryou.betteryoubackend.entity.UserProfile;
import ma.betteryou.betteryoubackend.repository.UserProfileRepository;
import ma.betteryou.betteryoubackend.service.UserProfileService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserProfileServiceImpl implements UserProfileService {

    private final UserProfileRepository repository;

    @Override
    public UserProfile create(UserProfile profile) {
        return repository.save(profile);
    }

    @Override
    public List<UserProfile> getAll() {
        return repository.findAll();
    }

    @Override
    public UserProfile getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profil introuvable"));
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }
}
