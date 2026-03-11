import api from "./axios";

import { Task } from "@/types/Task";
import {Comment, CommentAdd} from "@/types/Comment";


export type ErrorResponse = {
    error: string;
}


export async function getComments(taskId: number): Promise<Comment[]> {
    const response = await api.post("/comment", { taskId: taskId });
    return response.data;
}


export async function addComment(
    data: CommentAdd,
): Promise<Comment | ErrorResponse> {

    const response = await api.post<Task>("/comment/create", data);
    return response.data;
}



export async function deleteComment(
    taskId: number, commentId: number,
): Promise<Comment[] | ErrorResponse> {
    const columns = await api.delete("/comment", { taskId: taskId, commentId: commentId });
    return columns.data;
}