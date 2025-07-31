package com.portofolio.talkify.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.portofolio.talkify.service.GroupService;
import com.portofolio.talkify.utility.ApiResponse;
import com.portofolio.talkify.utility.ResponseUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/api/group")
public class ApiGroupController {

    @Autowired
    private GroupService groupService;

    @Transactional
    @GetMapping("/userGroup")
    public ResponseEntity<ApiResponse<Object>> getUserGroup(HttpServletRequest request){
        try {
            return groupService.listUserGroups(request);
        } catch (Exception e) {
            return ResponseUtil.generateErrorResponse("Failed to get user group", e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
