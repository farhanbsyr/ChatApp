export interface LastMessage {
  sender: number;
  receiver: number;
  message: string;
  createBy: number;
  createAt: string;
  isSeen: boolean;
  isImage: boolean;
}

export interface ProfileImage {
  image: string;
  userId: number;
}

export interface userChat {
  id: number;
  handphoneNumber: number;
  name: string;
  email: string;
  lastMessage: LastMessage;
  userFriends: boolean;
  profileImage: ProfileImage | null;
  pinned: boolean;
  isGroup: boolean;
  createdOn: string;
  conversationId: number;
  userGroupId: number;
  memberGroup: number;
  unSeenMessage: number;
}

export interface userMessage {
  id: number;
  receiverId?: number;
  senderId: number;
  isDelete: boolean;
  isUnsent: boolean;
  isSeen?: boolean;
  seen?: object[];
  message: string;
  name?: string;
  isGroup: boolean;
  createdOn: string;
  image?: string;
  isImage: boolean;
}

export interface sendUser {
  convertationId: number;
  receiverId: number;
}

export interface userProfile {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  profileImage?: string;
}

export interface typeFriend {
  name: string;
  identity: string;
  profile: string;
  isFriend: boolean;
}

export interface group {
  id: number;
  name: string;
  description: string;
  profileImage: string;
  member: number;
}
