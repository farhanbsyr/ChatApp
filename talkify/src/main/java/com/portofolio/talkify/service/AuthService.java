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
import com.portofolio.talkify.DTO.UserLoginProjection;
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
        
        UserLoginProjection user = userRepository.findUserByEmailOrNumber(users.getUsername());
        long expiredAccessToken = 15 * 60;
        // long expiredRefreshToken = 7 * 24 * 60 * 60;
        if (authentication.isAuthenticated()) {
            String token = jwtService.generateToken(users.getUsername(), user.getId(), expiredAccessToken * 1000);
            // String refreshToken = jwtService.generateToken(users.getUsername(), expiredRefreshToken * 1000);

            ResponseCookie cookie = ResponseCookie.from("access_token", token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(expiredAccessToken)
                .sameSite("Strict")
                .build();

            // ResponseCookie refreshCookie = ResponseCookie.from("refresh_token", refreshToken)
            //     .httpOnly(true)
            //     .secure(true)
            //     .path("/")
            //     .maxAge(expiredRefreshToken)
            //     .sameSite("Strict")
            //     .build();

            return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                // .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
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

    public ResponseEntity<Map<String,String>> clearCookie(){
        ResponseCookie deleteCookie = ResponseCookie.from("access_token", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .sameSite("Strict")
                .build();

            return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, deleteCookie.toString())
                .body(Map.of("message", "logout sukses"));

        
    }
}
