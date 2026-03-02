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
    createdAt: string

};

export async function getNotifications(): Promise<NotificationsResponse[] | ErrorResponse> {
    const response = await api.get<NotificationsResponse[]>("/notifications");
    return response.data;
}
