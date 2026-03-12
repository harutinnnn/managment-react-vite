export interface CommentAdd {
    id?: number
    taskId: number,
    content: string,
}

export interface Comment {
    id: number;
    taskId: number;
    userId: number;
    content: string;
    createdAt: Date;
    name:string;
}