package com.portofolio.talkify.modal;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table
public class UserConvertation extends BaseProperties {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userSatuId;
    private Long userDuaId;
    
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Long getUserSatuId() {
        return userSatuId;
    }
    public void setUserSatuId(Long userSatuId) {
        this.userSatuId = userSatuId;
    }
    public Long getUserDuaId() {
        return userDuaId;
    }
    public void setUserDuaId(Long userDuaId) {
        this.userDuaId = userDuaId;
    }

    
}
