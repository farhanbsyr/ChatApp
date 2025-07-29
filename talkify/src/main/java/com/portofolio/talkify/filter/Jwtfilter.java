package com.portofolio.talkify.filter;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.portofolio.talkify.service.JWTService;
import com.portofolio.talkify.service.MyUserDetailsService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class Jwtfilter extends OncePerRequestFilter {

    @Autowired
    JWTService jwtService;

    @Autowired
    ApplicationContext context;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        // String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;
        // String refreshTokeh = null;

        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
           
            for (Cookie cookie : cookies){
                if (cookie.getName().equals("access_token")) {
                    token = cookie.getValue();
                }
                // if (cookie.getName().equals("refresh_token")) {
                //     refreshTokeh = cookie.getValue();
                // }
            }
        }
        


        if (token != null) {
            username = jwtService.extractUserName(token);
        }

        // if (token == null) {
        //     response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        //     response.getWriter().write("Access token is missing");
        //     return;
        // }

        // if (authHeader != null && authHeader.startsWith("Bearer ")) {
        //     token = authHeader.substring(7);
        //     username = jwtService.extractUserName(token);
        // }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            
            UserDetails userDetails = context.getBean(MyUserDetailsService.class).loadUserByUsername(username);
            
            if (jwtService.validateToken(token, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = 
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        
        // if (refreshTokeh != null && token == null) {
        //     response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        //     response.getWriter().write("Access token is missing, please refresh");
        //     return;
        // }

        filterChain.doFilter(request, response);
    }

}
