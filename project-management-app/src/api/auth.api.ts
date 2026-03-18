import api from "./axios";
import {MemberJoinSkillType, MemberType} from "@/types/MemberType";

export type LoginPayload = {
    email: string;
    password: string;
};
export type ForgotPayload = {
    email: string;
};

export type RegisterPayload = {
    companyName: string;
    name: string;
    email: string;
    gender: string;
    phone: string;
    password: string;
    address: string;
};

export type LoginResponse = {
    token: string;
    refreshToken: string;
    user: MemberType;
};

export type ForgotResponse = {
    email: string;
    message: string;
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

export async function forgotRequest(
    data: ForgotPayload
): Promise<ForgotResponse | ErrorResponse> {
    const response = await api.post<ForgotResponse>("/auth/forgot", data);
    return response.data;
}

export async function refreshRequest(refreshToken: string) {
    const response = await api.post("/auth/refresh", {refreshToken});
    return response.data;
}

export async function logoutRequest() {
    return api.post("/auth/logout");
}

export async function getMeRequest(): Promise<MemberJoinSkillType | null> {
    const response = await api.get<MemberJoinSkillType>("/auth/me");
    return response.data;
}

export async function addMemberAvatar(data: FormData): Promise<MemberType | null> {
    const response = await api.post("/member/avatar", data, {
        headers: {"Content-Type": "multipart/form-data"}
    });
    return response.data;
}