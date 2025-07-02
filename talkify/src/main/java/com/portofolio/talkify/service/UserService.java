package com.portofolio.talkify.service;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.portofolio.talkify.modal.User;
import com.portofolio.talkify.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public Object getProfile(Long userId) {
        Map<String, Object> response = new HashMap<>();
        String base64String = null;
        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            return null;
        }

        response.put("id", userId);
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("phoneNumber", user.getHandphoneNumber());

        if (user.getProfileImage() != null) {
            base64String = Base64.getEncoder().encodeToString(user.getProfileImage().getImage());
        }
        response.put("profileImage", base64String);

        return response;
    }
}
