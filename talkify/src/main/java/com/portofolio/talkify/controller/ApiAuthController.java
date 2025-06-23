package com.portofolio.talkify.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.portofolio.talkify.DTO.LoginDTO;
import com.portofolio.talkify.modal.User;
import com.portofolio.talkify.service.AuthService;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/auth")
public class ApiAuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public Object userLogin(@RequestBody LoginDTO user){
        return authService.login(user);
    }

    @PostMapping("/register")
    public Object userRegister(@RequestBody User user){
        return authService.register(user);
    }

    @PostMapping("/logout")
    public Object logout(){
        return authService.clearCookie();
    }

}
