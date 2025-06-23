package com.portofolio.talkify.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.portofolio.talkify.service.TokenService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/token")
public class ApiTokenController {

    @Autowired
    TokenService tokenService;

    @PostMapping("/refresh")
    public Object refreshToken (HttpServletRequest request){
        return tokenService.newAccessToken(request);
    }
}
