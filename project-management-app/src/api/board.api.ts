import api from "./axios";
import { Priorities } from "@/enums/Priorities";
import { KanbanData } from "@/types/KanbanData";
import type { Column } from "@/types/Column";
import { Task, TaskAdd, TaskListItem } from "@/types/Task";
import { TaskFileType } from "@/types/TaskFileType";

export type BoardColumnPayload = {
    id?: number;
    projectId: number;
    title: string;
};

export type SortColumnsPayload = {
    projectId: number;
    columns: number[];
};

export type SortTablePayloadItem = {
    columnId: number;
    taskIds: number[];
}
export type SortTasksPayload = {
    draggedTaskId?: number;
    projectId: number;
    columns: SortTablePayloadItem[]
};

export type TaskPayload = {
    id: number;
    projectId: number;
    columnId: number;
    title: string;
    description: string;
    priority: Priorities;
    assignee: number[];
    createdAt?: Date;
    dueDate?: Date | null;
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
    const response = await api.post("/board/project", { projectId: projectId });
    return response.data;
}

export async function getTasksList(): Promise<TaskListItem[]> {
    const response = await api.get("/board/tasks");
    return response.data;
}


export async function addBoardColumn(
    data: BoardColumnPayload,
): Promise<AddBoardColumnResponse | ErrorResponse> {
    const response = await api.post<AddBoardColumnResponse>("/board/column", data);
    return response.data;
}

export async function addTask(
    data: TaskAdd,
): Promise<Task | ErrorResponse> {

    const response = await api.post<Task>("/board/task", data);
    return response.data;
}

export async function editTask(
    data: TaskPayload,
): Promise<TaskPayload | ErrorResponse> {

    const response = await api.put<TaskPayload>("/board/task", data);
    return response.data;
}


export async function sortColumns(
    data: SortColumnsPayload,
): Promise<Column[] | ErrorResponse> {
    const columns = await api.post("/board/sort-column", data);
    return columns.data;
}

export async function sortTasks(
    data: SortTasksPayload,
): Promise<Column[] | ErrorResponse> {
    const columns = await api.post("/board/sort-tasks", data);
    return columns.data;
}

export async function deleteColumn(
    columnId: number,
    projectId: number
): Promise<Column[] | ErrorResponse> {
    const columns = await api.post("/board/delete-column", { columnId: columnId, projectId: projectId });
    return columns.data;
}

export async function deleteTask(
    taskId: number, columnId: number,
): Promise<Column[] | ErrorResponse> {
    const columns = await api.post("/board/delete-task", { taskId: taskId, columnId: columnId });
    return columns.data;
}

export async function addTaskFile(data: FormData): Promise<TaskFileType> {
    const response = await api.post("/board/task-file", data, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
}

export async function removeTaskFile(taskId: number, fileId: number): Promise<TaskFileType> {
    const response = await api.post("/board/remove-task-file", { taskId: taskId, fileId: fileId },);
    return response.data;
}

export async function taskFileList(taskId: number): Promise<TaskFileType[] | []> {
    const response = await api.get("/board/task-files/" + taskId);
    return response.data;
}