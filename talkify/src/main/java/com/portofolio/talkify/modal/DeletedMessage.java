package com.portofolio.talkify.modal;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table
public class DeletedMessage  extends BaseProperties{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long convertationId;
    private Long users;
    private String messageTYPE;
    private Long messageId;

    public Long getMessageId() {
        return messageId;
    }
    public void setMessageId(Long messageId) {
        this.messageId = messageId;
    }
    public Long getId() {
        return id;
    }
    public String getMessageTYPE() {
        return messageTYPE;
    }
    public void setMessageTYPE(String messageTYPE) {
        this.messageTYPE = messageTYPE;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Long getConvertationId() {
        return convertationId;
    }
    public void setConvertationId(Long convertationId) {
        this.convertationId = convertationId;
    }
    public Long getUsers() {
        return users;
    }
    public void setUsers(Long users) {
        this.users = users;
    }
}
