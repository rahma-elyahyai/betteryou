package ma.betteryou.betteryoubackend.service;

import ma.betteryou.betteryoubackend.DTO.RegisterRequest;
import ma.betteryou.betteryoubackend.DTO.LoginRequest;
import ma.betteryou.betteryoubackend.entity.user.User;


public interface UserService {
    public User Login(LoginRequest request);
    public User register(RegisterRequest request);
}
