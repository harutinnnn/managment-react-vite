import {Priorities} from "@/enums/Priorities";

export interface Task {
    id: number;
    projectId: number;
    columnId: number;
    title: string;
    description: string;
    priority: Priorities;
    assignee: number[];
    createdAt: Date;
    dueDate?: Date | null;
}

export interface TaskListItem extends Task {
    columnTitle: string,
    projectTitle: string,
    members: string,
}