package com.portofolio.talkify.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.portofolio.talkify.modal.UserConvertation;

public interface UserConvertaionRepository extends JpaRepository<UserConvertation, Long>{

    @Query(value = """
            select * from user_convertation uc where user_satu_id = ?1 or user_dua_id = ?1;
            """, nativeQuery = true)
    List<UserConvertation> listConvertations(Long userId);
}
