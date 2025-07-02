package com.portofolio.talkify.service;

import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.portofolio.talkify.modal.Group;
import com.portofolio.talkify.modal.UserGroups;
import com.portofolio.talkify.repository.GroupRepository;
import com.portofolio.talkify.repository.UserGroupsRepository;
import com.portofolio.talkify.utility.ApiResponse;
import com.portofolio.talkify.utility.ResponseUtil;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class GroupService {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private UserGroupsRepository userGroupsRepository;

    @Autowired
    private GroupRepository groupRepository;

    public ResponseEntity<ApiResponse<Object>> listUserGroups(HttpServletRequest request) {
        String token = tokenService.getTokenFromCookie(request.getCookies(), "access_token");
        List<Object> response = new ArrayList<>();;
        if (token == null) {
            return ResponseUtil.generateErrorResponse("Token is not found", token, HttpStatus.FORBIDDEN);
        }

        Long userId = jwtService.extractUserId(token);

        if (userId == null) {
            return ResponseUtil.generateErrorResponse("User is not found", userId, HttpStatus.NOT_FOUND);
        }

        List<UserGroups> listUserGroups = userGroupsRepository.listUserGroups(userId);

        for (UserGroups userGroups : listUserGroups) {
            Object groupProfile = getGroup(userGroups.getGroupId());
            response.add(groupProfile);
        }

        return ResponseUtil.generateSuccessResponse("Success to get user groups", response);
    }

    public Object getGroup(Long groupId){
        Map<String, Object> response = new HashMap<>();
        String base64String = null;
        Group group = groupRepository.findById(groupId).orElse(null);
        List<UserGroups> memberGroup = userGroupsRepository.listGroupsByGroupId(groupId);
        if (group == null) {
            return null;
        }

        response.put("id", group.getId());
        response.put("name", group.getGroupName());
        response.put("description", group.getGroupDescription());
        response.put("member", memberGroup.size());
        
        if (group.getProfileImage() != null) {
            base64String = Base64.getEncoder().encodeToString(group.getProfileImage().getImage());
        }
        response.put("profileImage", base64String);

        return response;
    }

}
