import api from "./axios";

import {MessageFullType, MessageType} from "@/types/MessageType";


export type SendMessagePayload = {
    senderId: number,
    receiverId: number,
    message: string;
}

export type   ReceiveMessagePayload = {
    id: number
}

export async function sendMessage(
    data: SendMessagePayload,
): Promise<ReceiveMessagePayload> {

    const response = await api.post<ReceiveMessagePayload>("/message/create", data);
    return response.data;
}

export async function getMemberMessages(
    memberId: number,
): Promise<MessageFullType[]> {

    const response = await api.post<MessageFullType[]>("/message", {memberId: memberId});
    return response.data;
}