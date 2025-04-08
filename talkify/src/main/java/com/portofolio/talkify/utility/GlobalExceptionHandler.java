package com.portofolio.talkify.utility;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import jakarta.servlet.http.HttpServletRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public Object handleExceptionGlobal(Exception e, HttpServletRequest request){
        if (request.getRequestURI().contains("api")) {
            return ResponseUtil.generateErrorResponse("An unexpected error occured", e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
         }
         return "";    
    }
}
