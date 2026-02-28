import api from "./axios";

import {ProjectStatuses, ProjectType} from "@/types/ProjectType";

export type ProjectPayload = {
    id?: number;
    title: string;
    status: ProjectStatuses;
    description: string;
};
export type AddProjectResponse = {
    title: string;
    description: string;
    status: ProjectStatuses;
};

export type ErrorResponse = {
    error: string;
}


export async function addProject(
    data: ProjectPayload,
): Promise<AddProjectResponse | ErrorResponse> {
    const response = await api.post<AddProjectResponse>("/project", data);
    return response.data;
}

export async function editProject(
    data: ProjectPayload,
): Promise<AddProjectResponse | ErrorResponse> {
    const response = await api.post<AddProjectResponse>("/project", data);
    return response.data;
}

export async function getProjects(): Promise<ProjectType[]> {
    const response = await api.get<ProjectType[]>("/project");
    return response.data;
}

export async function getProject(id: number): Promise<ProjectType> {
    const response = await api.get<ProjectType>(`/project/${id}`);
    return response.data;
}

export async function deleteProject(
    id: number,
): Promise<AddProjectResponse | ErrorResponse> {
    const response = await api.delete<AddProjectResponse>(`/project/${id}`);
    return response.data;
}
