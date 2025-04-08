package com.portofolio.talkify.modal;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table
public class GroupMessage extends BaseProperties {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long groupId;
    private Long senderMessage;
    private String message;
    private Boolean isUnsend;

    @ManyToOne
    @JoinColumn(name = "groupId", insertable = false, updatable = false)
    private Group group;

    // permasalahan di sini 
    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "senderMessage", insertable = false, updatable = false)
    // private User sender;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getSenderMessage() {
        return senderMessage;
    }

    public void setSenderMessage(Long senderMessage) {
        this.senderMessage = senderMessage;
    }

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public Group getGroup() {
        return group;
    }

    public void setGroup(Group group) {
        this.group = group;
    }

    public Boolean getIsUnsend() {
        return isUnsend;
    }

    public void setIsUnsend(Boolean isUnsend) {
        this.isUnsend = isUnsend;
    }

    // public User getSender() {
    //     return sender;
    // }

    // public void setSender(User sender) {
    //     this.sender = sender;
    // }

}
