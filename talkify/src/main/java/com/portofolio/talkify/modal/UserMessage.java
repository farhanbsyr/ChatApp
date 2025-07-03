package com.portofolio.talkify.modal;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;


@Entity
@Table
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserMessage extends BaseProperties {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long idUserConvertation;
    private Long sender;
    private Long receiver;
    private String message;
    private Boolean isSeen;
    private Boolean isUnsend;
    private Boolean isImage;

    @ManyToOne
    @JoinColumn(name = "idUserConvertation", insertable = false, updatable = false)
    private UserConvertation userConvertation;

    public Long getIdUserConvertation() {
        return idUserConvertation;
    }

    public void setIdUserConvertation(Long idUserConvertation) {
        this.idUserConvertation = idUserConvertation;
    }

    public UserConvertation getUserConvertation() {
        return userConvertation;
    }

    public void setUserConvertation(UserConvertation userConvertation) {
        this.userConvertation = userConvertation;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public Long getSender() {
        return sender;
    }

    public void setSender(Long sender) {
        this.sender = sender;
    }

    public Long getReceiver() {
        return receiver;
    }

    public void setReceiver(Long receiver) {
        this.receiver = receiver;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
    
    // public User getSenderMessage() {
    //     return senderMessage;
    // }

    // public void setSenderMessage(User senderMessage) {
    //     this.senderMessage = senderMessage;
    // }

    // public User getReceiveMessage() {
    //     return receiveMessage;
    // }

    // public void setReceiveMessage(User receiveMessage) {
    //     this.receiveMessage = receiveMessage;
    // }

    public Boolean getIsSeen() {
        return isSeen;
    }

    public void setIsSeen(Boolean isSeen) {
        this.isSeen = isSeen;
    }

    public Boolean getIsUnsend() {
        return isUnsend;
    }

    public void setIsUnsend(Boolean isUnsend) {
        this.isUnsend = isUnsend;
    }

    public Boolean getIsImage() {
        return isImage;
    }

    public void setIsImage(Boolean isImage) {
        this.isImage = isImage;
    }

    
}
