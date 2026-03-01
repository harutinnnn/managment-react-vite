import {Priorities} from "@/enums/Priorities";

export interface Task {
    id: number;
    projectId: number;
    columnId: number;
    title: string;
    description: string;
    priority: Priorities;
    assignee?: number | null;
    createdAt: Date;
    dueDate?: Date;
    tags?: string[];
}
