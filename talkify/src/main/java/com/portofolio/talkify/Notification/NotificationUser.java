package com.portofolio.talkify.Notification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class NotificationUser {
    private Long id;
    private Long convertationId;
    private Long senderId;
    private Long receiverId;
    private String message;
    private Boolean isSeen;
    private Boolean isUnsend;
    private MessageTYPE messageTYPE;
    private Boolean isImage;
}
