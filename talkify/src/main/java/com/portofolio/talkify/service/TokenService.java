package com.portofolio.talkify.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

@Service
public class TokenService {

    @Autowired
    JWTService jwtService;

    public Object newAccessToken(HttpServletRequest request) {
        String refreshToken = null;
        String username = null;
        String token = null;
        long userId;
        long expiredAccessToken = 15 * 60 * 1000;


        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
           
            for (Cookie cookie : cookies){
                System.out.println("Nama Cookie: " + cookie.getName());
                System.out.println("Value: " + cookie.getValue());
                if (cookie.getName().equals("refresh_token")) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }

        if (refreshToken == null || jwtService.isTokenExpired(refreshToken)) {
            return ResponseEntity.status(403).body(Map.of("message", "Refresh token is expired"));
        }

        if (refreshToken != null) {
            username = jwtService.extractUserName(refreshToken);
            userId = jwtService.extractUserId(refreshToken);
            token = jwtService.generateToken(username, userId, expiredAccessToken);
        }

         ResponseCookie cookie = ResponseCookie.from("access_token", token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(expiredAccessToken)
                .sameSite("Strict")
                .build();

            return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(Map.of("message", "Login sukses"));

        
    }

    public String getTokenFromCookie (Cookie[] cookies, String tokenName){
        String token = null;
        
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals(tokenName)) {
                    token = cookie.getValue();
                }
            }
        }

        if (token == null) {
            return "token has no value";
        }
        return token;
    }

}
