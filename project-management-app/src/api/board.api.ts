import api from "./axios";
import {Priorities} from "@/enums/Priorities";
import {KanbanData} from "@/types/KanbanData";
import type {Column} from "@/types/Column";

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
    id: string;
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
    pos: number;
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
    data: Omit<TaskPayload, 'boardColumnId' | 'id'>,
): Promise<AddBoardColumnResponse | ErrorResponse> {

    const response = await api.post<AddBoardColumnResponse>("/board/task", data);
    return response.data;
}


export async function sortColumns(
    data: SortColumnsPayload,
): Promise<Column[] | ErrorResponse> {
    const columns = await api.post("/board/sort-column", data);
    return columns.data;
}

export async function deleteColumn(
    columnId: number,
    projectId:number
): Promise<Column[] | ErrorResponse> {
    const columns = await api.post("/board/delete-column", {columnId: columnId, projectId: projectId});
    return columns.data;
}

export async function deleteTask(
    taskId: number, columnId: number,
): Promise<Column[] | ErrorResponse> {
    const columns = await api.post("/board/delete-task", {taskId: taskId, columnId: columnId});
    return columns.data;
}
