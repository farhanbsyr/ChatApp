package com.portofolio.talkify.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.portofolio.talkify.modal.UserFriends;

public interface UserFriendsRepository extends JpaRepository <UserFriends, Long>{


    @Query(value = """
            select * from user_friends uf where user_id = ?1;
            """, nativeQuery = true)
    List<UserFriends> findByUserId(Long id);

    @Query(value  = """
          SELECT up.* ,  uf.user_friend_id
FROM user_friends uf
JOIN user_profile up ON up.user_id = uf.user_friend_id
WHERE uf.user_id = ?1;
            """, nativeQuery = true)
    List<UserFriends> findFullProfile(Long id);


    @Query(value = """
                    select * from user_friends uf where user_id = ?1 and user_friend_id = ?2 and is_delete = false ;
                    """, nativeQuery = true)
        UserFriends findUserFriendByIdFriends(Long userId, Long friendId);
    
}
