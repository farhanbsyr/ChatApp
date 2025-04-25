package com.portofolio.talkify.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.portofolio.talkify.modal.GroupMessage;

public interface GroupMessageRepository extends JpaRepository<GroupMessage, Long> {

    @Query(value = """
            select * from group_message gm 
where group_id = ?1 
order by created_on desc limit  1;
            """, nativeQuery = true)
    GroupMessage lastGroupMessage(Long groupId);

    @Query(value = """
            select * from group_message gm 
            where group_id = ?1
            order by created_on asc ;
            """, nativeQuery = true)
    List<GroupMessage> listGroupMessages(Long groupId);

    @Query(value = """
                    select * from group_message gm where 
                    group_id = ?1 and 
                    sender_message != ?2 and 
                    created_on > ?3 ;
                    """, nativeQuery = true)
    List<GroupMessage> listFalseGroupMessages(Long groupId, Long userId, Date date);

    @Query(value = """
        select count(*) from group_message gm where 
        group_id = ?1 and 
        sender_message != ?2 and 
        created_on > ?3 ;
        """, nativeQuery = true)
        Long countFalseGroupMessage(Long groupId, Long userId, Date date);


}


