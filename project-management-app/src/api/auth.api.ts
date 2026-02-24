import api from "./axios";

export type LoginPayload = {
    email: string;
    password: string;
};

export type User = {
    id: number;
    email: string;
};

export type LoginResponse = {
    token: string;
    refreshToken: string;
    user: User;
};

export async function loginRequest(
    data: LoginPayload
): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/auth/login", data);
    return response.data;
}

export async function refreshRequest(refreshToken: string) {
    const response = await api.post("/auth/refresh", { refreshToken });
    return response.data;
}

export async function logoutRequest() {
    return api.post("/auth/logout");
}

export async function getMeRequest(): Promise<User> {
    const response = await api.get<User>("/auth/me");
    return response.data;
}