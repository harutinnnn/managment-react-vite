import api from "./axios";
import {MemberType} from "@/types/MemberType";

export type MemberPayload = {
    email: string;
    phone: string,
    name: string;
    professionId: number;
};
export type AddMemberResponse = {
    email: string;
    name: string;
};
export type UpdateProfileResponse = {
    name: string;
    phone: string;
    professionId: number;
    skills: number[];
};

export type ErrorResponse = {
    error: string;
}


export async function addMember(
    data: MemberPayload
): Promise<AddMemberResponse | ErrorResponse> {
    const response = await api.post<AddMemberResponse>("/member", data);
    return response.data;
}

export async function updateProfileRequest(
    data: UpdateProfileResponse
): Promise<UpdateProfileResponse | ErrorResponse> {
    const response = await api.post<UpdateProfileResponse>("/auth/me", data);
    return response.data;
}

export async function getMembers(): Promise<MemberType[]> {
    const response = await api.get<MemberType[]>("/member");
    return response.data;
}

export async function getMember(id: number): Promise<MemberType> {
    const response = await api.get<MemberType>(`/member/${id}`);
    return response.data;
}