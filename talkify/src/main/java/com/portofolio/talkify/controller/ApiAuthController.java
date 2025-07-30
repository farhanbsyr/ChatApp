package com.portofolio.talkify.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.portofolio.talkify.DTO.LoginDTO;
import com.portofolio.talkify.modal.User;
import com.portofolio.talkify.service.AuthService;
import com.portofolio.talkify.utility.ApiResponse;
import com.portofolio.talkify.utility.ResponseUtil;

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
    public ResponseEntity<ApiResponse<String>> userRegister(@RequestBody User user){
        try {
            authService.register(user);
            return ResponseUtil.generateSuccessResponse("Success to register user", null, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseUtil.generateErrorResponse("Failed to register", e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/logout")
    public Object logout(){
        return authService.clearCookie();
    }

    @GetMapping("/check")
    public Object check(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null 
        || !authentication.isAuthenticated() 
        || authentication.getPrincipal().equals("anonymousUser")) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token invalid or expired");
    }
    return ResponseEntity.ok("Token valid");
    }

}
