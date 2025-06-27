package com.portofolio.talkify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.portofolio.talkify.modal.ProfileImage;

public interface ProfileImageRepository extends JpaRepository<ProfileImage, Long> {

    @Query(value = """
            select pi2.* from 
            profile_image pi2 join users u 
            on u.id_profile_image = pi2.id 
            where pi2.user_id = ?1;
            """, nativeQuery = true)
    ProfileImage findImangeProfileUser(Long userId);
}
