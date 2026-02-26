import api from "./axios";
import {User} from "@/types/User";

export type LoginPayload = {
    email: string;
    password: string;
};

export type RegisterPayload = {
    companyName: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    address: string;
};

export type LoginResponse = {
    token: string;
    refreshToken: string;
    user: User;
};


export type ErrorResponse = {
    error: string;
}

export async function registerRequest(
    data: RegisterPayload
): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/auth/register", data);
    return response.data;
}

export async function loginRequest(
    data: LoginPayload
): Promise<LoginResponse | ErrorResponse> {
    const response = await api.post<LoginResponse>("/auth/login", data);
    return response.data;
}

export async function refreshRequest(refreshToken: string) {
    const response = await api.post("/auth/refresh", {refreshToken});
    return response.data;
}

export async function logoutRequest() {
    return api.post("/auth/logout");
}

export async function getMeRequest(): Promise<User | null> {
    const response = await api.get<User>("/auth/me");
    return response.data;
}

export async function addMemberAvatar(data: FormData): Promise<User | null> {
    const response = await api.post("/member/avatar", data, {
        headers: {"Content-Type": "multipart/form-data"}
    });
    return response.data;
}