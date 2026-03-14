export interface CommentAdd {
    id?: number
    taskId: number,
    content: string,
}
export interface CommentDelete {
    taskId: number,
    commentId: number,
}

export interface Comment {
    id: number;
    taskId: number;
    userId: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    name:string;
}