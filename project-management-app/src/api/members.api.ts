import api from "./axios";

export type MemberPayload = {
    email: string;
    name: string;
};
export type AddMemberResponse = {
    email: string;
    name: string;
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

export async function getMembers(): Promise<any> {
    const response = await api.get<AddMemberResponse>("/member");
    return response.data;
}