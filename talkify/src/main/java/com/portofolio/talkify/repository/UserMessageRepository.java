package com.portofolio.talkify.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.portofolio.talkify.modal.UserMessage;

public interface UserMessageRepository extends JpaRepository<UserMessage, Long> {

    @Query(value = """
            select * from user_message um 
            where 
                id_user_convertation = ?1
                and is_delete = false 
            order by created_on desc limit 1;
            """, nativeQuery = true)
    UserMessage lastMessage(Long idConvertation);

    @Query(value = """
            select * from user_message um 
            where id_user_convertation = ?1 
            order by created_on asc;
            """, nativeQuery = true)
    List<UserMessage> listMessages(Long convertationId);

    @Query(value = """
             select * from user_message um where is_seen = false and id_user_convertation = ?1 and sender != ?2 ;
            """, nativeQuery = true)
    List<UserMessage> listFalseMessage(Long conversationId, Long userId);

    @Query(value = """
        select count(*) from user_message um where is_seen = false and id_user_convertation = ?1 and sender != ?2 ;
       """, nativeQuery = true)
        Long countFalseMessage(Long conversationId, Long userId);

}
