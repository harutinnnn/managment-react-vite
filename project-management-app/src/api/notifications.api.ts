import api from "./axios";
import {NotificationActionTypesEnum, NotificationTypesEnum} from "@/enums/NotificationTypesEnum";
import {ErrorResponse} from "@/api/auth.api";


export type NotificationsResponse = {
    id: number;
    userId: number;
    types: NotificationTypesEnum;
    actionTypes: NotificationActionTypesEnum;
    message: string;
    objectId: number | null;
    isRead: 1 | 0
    json: string
    createdAt: string
};

export type UpdateNotification = {
    id: number;
}

export async function getNotifications(): Promise<NotificationsResponse[] | ErrorResponse> {
    const response = await api.get("/notifications");
    return response.data;
}

export async function setUpdateNotification(data: UpdateNotification): Promise<UpdateNotification | ErrorResponse> {
    const response = await api.post("/notifications/update", data);
    return response.data;
}
