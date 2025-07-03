package com.portofolio.talkify.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.portofolio.talkify.modal.ChatConvertation;

public interface ChatConvertationRepository extends JpaRepository<ChatConvertation, Long> {

    @Query(value = """
            select * from chat_convertation cc where user_convertation_id = ?1;
            """, nativeQuery = true)
    List<ChatConvertation> findByUserConvertationId(Long userConvertationId);

    @Query(value = """
            select * from chat_convertation cc where user_convertation_id = ?1 and user_id = ?2;
            """, nativeQuery = true)
    ChatConvertation findByUserConvertationIdAndUserId(Long userConvertationId, Long userId);
}

