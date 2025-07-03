package com.portofolio.talkify.modal;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table
public class ChatConvertation extends BaseProperties{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userConvertationId;
    private Long userId;
    private Boolean isPINNED;
    
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    public Boolean getIsPINNED() {
        return isPINNED;
    }
    public void setIsPINNED(Boolean isPINNED) {
        this.isPINNED = isPINNED;
    }
    public Long getUserConvertationId() {
        return userConvertationId;
    }
    public void setUserConvertationId(Long userConvertationId) {
        this.userConvertationId = userConvertationId;
    }

    
}
