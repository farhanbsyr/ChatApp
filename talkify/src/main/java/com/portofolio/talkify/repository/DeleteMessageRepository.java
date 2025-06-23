package com.portofolio.talkify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.portofolio.talkify.modal.DeletedMessage;

public interface DeleteMessageRepository extends JpaRepository<DeletedMessage, Long> {

    @Query(value = """
            select * from deleted_message dm
             where convertation_id = ?1 
             and users = ?2 
             and message_id = ?3;
            """, nativeQuery = true)
    DeletedMessage deletedMsg(Long idConvertation, Long userId, Long messageId);
}
