package com.portofolio.talkify.modal;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@Entity
@Table
public class ProfileImage extends BaseProperties {
  @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private Boolean isGroup;
    @Lob
    private byte[] image;

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
    public byte[] getImage() {
      return image;
    }
    public void setImage(byte[] image) {
      this.image = image;
    }
    public Boolean getIsGroup() {
      return isGroup;
    }
    public void setIsGroup(Boolean isGroup) {
      this.isGroup = isGroup;
    }

    
}
