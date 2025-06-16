package com.portofolio.talkify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.portofolio.talkify.modal.User;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);

    @Query(value = """
            select * from users u where email = '?1' and "password" = '?2';
            """, nativeQuery = true)
    User findUser(String username, String password);

    @Query(value = """
            select * from users u where email = ?1 or "handphone-number" = ?1; 
            """, nativeQuery = true)
    User findUserByEmailOrNumber(String userIdentity);
}
