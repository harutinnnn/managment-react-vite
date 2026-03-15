import api from "./axios";

import {MessageType} from "@/types/MessageType";


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
): Promise<MessageType[]> {

    const response = await api.post<MessageType[]>("/message", {memberId: memberId});
    return response.data;
}