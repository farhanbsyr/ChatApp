package com.portofolio.talkify.repository;

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
}
// select gm.message, gm.created_on as createdOn, gm.created_by as createdBy,
// u.id , u.email ,u."handphone-number" as handphoneNumber , u.id_profile_image, u."name" 
// from group_message gm 
// join users u on gm.sender_message = u.id 
// where group_id = ?1
// order by gm.created_on  desc limit 1;
