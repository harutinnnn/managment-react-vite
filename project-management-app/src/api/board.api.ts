import api from "./axios";
import {ProfessionType} from "@/types/ProfessionType";
import {Priorities} from "@/enums/Priorities";
import {KanbanData} from "@/types/KanbanData";

export type BoardColumnPayload = {
    id?: number;
    projectId: number;
    title: string;
};

export type SortColumnsPayload = {
    projectId: number;
    columns: number[];
};

export type TaskPayload = {
    id?: string;
    projectId: number;
    columnId: number;
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


export async function getBoardData(projectId: number): Promise<KanbanData> {
    const response = await api.post("/board/project", {projectId: projectId});
    return response.data;
}


export async function addBoardColumn(
    data: BoardColumnPayload,
): Promise<AddBoardColumnResponse | ErrorResponse> {
    const response = await api.post<AddBoardColumnResponse>("/board/column", data);
    return response.data;
}

export async function addTask(
    data: Omit<TaskPayload, 'boardColumnId'>,
): Promise<AddBoardColumnResponse | ErrorResponse> {

    const response = await api.post<AddBoardColumnResponse>("/board/task", data);
    return response.data;
}


export async function sortColumns(
    data: SortColumnsPayload,
): Promise<void | ErrorResponse> {
    await api.post<AddBoardColumnResponse>("/board/sort-column", data);
}
