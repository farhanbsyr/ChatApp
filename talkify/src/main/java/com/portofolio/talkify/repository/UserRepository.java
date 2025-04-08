package com.portofolio.talkify.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.portofolio.talkify.modal.User;

public interface UserRepository extends JpaRepository<User, Long> {

    
}
