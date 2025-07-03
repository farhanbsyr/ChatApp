package com.portofolio.talkify.cloudinary;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Configuration
public class CloudinaryConfig {
    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "dwopxxwu4",
                "api_key", "662784169187862",
                "api_secret", "CVHMUAg5cS2MEmED3ZoX2LmuQzQ",
                "secure", true
        ));
    }
}
