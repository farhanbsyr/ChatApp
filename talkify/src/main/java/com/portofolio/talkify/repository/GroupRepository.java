package com.portofolio.talkify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.portofolio.talkify.modal.Group;

public interface GroupRepository extends JpaRepository<Group, Long> {

    @Query(value = """
            select count(*) from user_groups ug where  group_id = ?1; 
            """, nativeQuery = true)
    Integer countMemberGroup(Long groupId);
}
