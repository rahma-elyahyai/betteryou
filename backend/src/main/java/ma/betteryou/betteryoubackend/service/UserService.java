package ma.betteryou.betteryoubackend.service;
import ma.betteryou.betteryoubackend.entity.User;

import ma.betteryou.betteryoubackend.DTO.RegisterRequest;
import ma.betteryou.betteryoubackend.DTO.LoginRequest;


public interface UserService {
    public User Login(LoginRequest request);
    public User register(RegisterRequest request);
}
