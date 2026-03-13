import api from "./axios";

import {Task} from "@/types/Task";
import {Comment, CommentAdd, CommentDelete} from "@/types/Comment";


export type ErrorResponse = {
    error: string;
}


export async function getComments(taskId: number): Promise<Comment[]> {
    const response = await api.post("/comment", {taskId: taskId});
    return response.data;
}


export async function addComment(
    data: CommentAdd,
): Promise<Comment> {

    const response = await api.post<Comment>("/comment/create", data);
    return response.data;
}


export async function deleteComment(
    commentId: number
): Promise<Comment | ErrorResponse> {
    const columns = await api.delete("/comment/" + commentId);
    return columns.data;
}