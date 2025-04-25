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
public class NotificationSeen {
    private Long conversationId;
    private Long userId;
    private MessageTYPE messageTYPE;
}
