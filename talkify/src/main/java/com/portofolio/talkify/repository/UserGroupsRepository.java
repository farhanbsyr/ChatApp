package com.portofolio.talkify.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.portofolio.talkify.modal.UserGroups;

public interface UserGroupsRepository extends JpaRepository<UserGroups, Long> {

    @Query(value = """
            select * from user_groups ug where user_id = ?1 and is_delete = false;
            """, nativeQuery = true)
    List<UserGroups> listUserGroups(Long userId);

    @Query(value = """
            select * from user_groups ug where group_id = ?1;
            """, nativeQuery = true)
    List<UserGroups> listGroupsByGroupId(Long groupId);

    @Query(value  = """
        select * from user_groups ug where group_id = ?1
                    """, nativeQuery = true)
        List<UserGroups> listUserGroupByIdGroup (Long id);
}
