package ma.betteryou.betteryoubackend.service.impl;

import ma.betteryou.betteryoubackend.entity.user.User;
import ma.betteryou.betteryoubackend.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
//cette classe utilisé par spring security c'est elle qui dire á SS comment recuperer les données du BD et elle retourne un objet que UserDetails va implementer
@Service
public class UserDetailsServiceImp implements UserDetailsService {
    private UserRepository userRepository;
    public UserDetailsServiceImp(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<User> optUser=userRepository.findByEmail(email);
        User user=optUser.orElseThrow(()->new UsernameNotFoundException(email));
        List<GrantedAuthority> grantedAuthorities = new ArrayList<>();
        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), grantedAuthorities);
    }
}
