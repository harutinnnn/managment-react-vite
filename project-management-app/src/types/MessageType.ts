
export interface MessageType {
    id?: string;
    companyId?: string;
    senderId: number;
    receiverId: number;
    message: string;
    isRead?: 1 | 0;
    createdAt?: Date | string;
    receiverName?: string;
    receiverAvatar?: string;
}