import api from "./axios";
import {ProfessionType} from "@/types/ProfessionType";
import {Priorities} from "@/enums/Priorities";

export type BoardColumnPayload = {
    id?: number;
    projectId: number;
    title: string;
};
export type TaskPayload = {
    id?: string;
    title: string;
    description: string;
    priority: Priorities;
    assignee?: string;
    createdAt?: Date;
    dueDate?: Date;
    tags?: string[];
};

export type AddBoardColumnResponse = {
    id: number;
    title: string;
};


export type ErrorResponse = {
    error: string;
}


export async function addBoardColumn(
    data: BoardColumnPayload,
): Promise<AddBoardColumnResponse | ErrorResponse> {
    const response = await api.post<AddBoardColumnResponse>("/board/column", data);
    return response.data;
}

export async function addTask(
    data: Omit<TaskPayload, 'projectId' | 'boardColumnId'>,
    projectId: number,
    boardColumnId: number
): Promise<AddBoardColumnResponse | ErrorResponse> {

    const parsedData = {
        ...data,
        projectId,
        boardColumnId
    }

    const response = await api.post<AddBoardColumnResponse>("/board/task", parsedData);
    return response.data;
}

export async function editProfession(
    data: BoardColumnPayload,
): Promise<AddBoardColumnResponse | ErrorResponse> {
    const response = await api.post<AddBoardColumnResponse>("/profession", data);
    console.log(response);
    return response.data;
}

export async function getProfessions(): Promise<ProfessionType[]> {
    const response = await api.get<ProfessionType[]>("/profession");
    return response.data;
}

export async function getProfession(id: number): Promise<ProfessionType> {
    const response = await api.get<ProfessionType>(`/profession/${id}`);
    return response.data;
}

export async function deleteProfession(
    id: number,
): Promise<AddBoardColumnResponse | ErrorResponse> {
    const response = await api.delete<AddBoardColumnResponse>(`/profession/${id}`);
    return response.data;
}
