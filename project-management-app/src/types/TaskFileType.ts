export type TaskFileType =
    {
        id: number
        taskId: number
        file: string
        fileType: string
        createdAt?: Date | string
    }