package ma.betteryou.betteryoubackend.service;

import ma.betteryou.betteryoubackend.entity.UserProfile;
import java.util.List;

public interface UserProfileService {

    UserProfile create(UserProfile profile);
    List<UserProfile> getAll();
    UserProfile getById(Long id);
    void delete(Long id);
}
