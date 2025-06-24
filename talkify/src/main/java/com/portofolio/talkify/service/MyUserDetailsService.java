package com.portofolio.talkify.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.portofolio.talkify.DTO.UserLoginProjection;
import com.portofolio.talkify.modal.UserPrincipal;
import com.portofolio.talkify.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        UserLoginProjection user = userRepository.findUserByEmailOrNumber(identifier);

        System.out.println(user);
        if (user == null) {
            System.out.println("User is not found");
            throw new UsernameNotFoundException("User is not found");
        }

        return new UserPrincipal(user, identifier);
    }
    
}
