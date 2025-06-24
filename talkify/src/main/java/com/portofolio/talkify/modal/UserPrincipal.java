package com.portofolio.talkify.modal;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.portofolio.talkify.DTO.UserLoginProjection;

public class UserPrincipal implements UserDetails {

    private UserLoginProjection user;
    private String inputIndentifier;

    public UserPrincipal(UserLoginProjection user, String inputIndentifier){
        this.user = user;
        this.inputIndentifier = inputIndentifier;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getPassword() {
        // TODO Auto-generated method stub
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        // TODO Auto-generated method stub
        return inputIndentifier;
    }

}
