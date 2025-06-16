package com.portofolio.talkify.service;

import java.util.Date;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.portofolio.talkify.DTO.LoginDTO;
import com.portofolio.talkify.modal.User;
import com.portofolio.talkify.repository.UserRepository;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired 
    private AuthenticationManager authenticationManager;

    @Autowired
    private JWTService jwtService;

    private BCryptPasswordEncoder bcrypt = new BCryptPasswordEncoder(12);

    public ResponseEntity<Map<String, String>> login (LoginDTO users){
        Authentication authentication = 
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(users.getUsername(), users.getPassword()));
        
        if (authentication.isAuthenticated()) {
            String token = jwtService.generateToken(users.getUsername());

            ResponseCookie cookie = ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(24 * 60 * 60)
                .sameSite("Strict")
                .build();

            return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(Map.of("message", "Login sukses"));
        }
        
        return ResponseEntity.status(401).body(Map.of("message", "Login gagal"));
    }

    public User register (User user){
        user.setPassword(bcrypt.encode(user.getPassword()));

        user.setCreatedOn(new Date());
        user.setIsDelete(false);
        return userRepository.save(user);
    }
}
