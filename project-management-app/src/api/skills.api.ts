import api from "./axios";
import {SkillType} from "@/types/SkillType";

export type SkillPayload = {
    name: string;
};
export type AddSkillResponse = {
    name: string;
};

export type ErrorResponse = {
    error: string;
}


export async function addSkill(
    data: SkillPayload,
): Promise<AddSkillResponse | ErrorResponse> {
    const response = await api.post<AddSkillResponse>("/skills", data);
    return response.data;
}

export async function getSkills(): Promise<SkillType[]> {
    const response = await api.get<SkillType[]>("/skills");
    return response.data;
}

export async function getSkill(id: number): Promise<SkillType> {
    const response = await api.get<SkillType>(`/skills/${id}`);
    return response.data;
}

export async function deleteSkill(
    id: number,
): Promise<AddSkillResponse | ErrorResponse> {
    const response = await api.delete<AddSkillResponse>(`/skills/${id}`);
    return response.data;
}
