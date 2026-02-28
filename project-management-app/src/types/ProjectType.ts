import {Statuses} from "@/enums/Statuses";

export type ProjectType = {
    id: number;
    status: ProjectStatuses;
    title: string;
    progress: number;
    description: string;
    createdAt: Date;
}


export enum ProjectStatuses {
    PENDING = Statuses.PENDING,
    COMPLETED = Statuses.COMPLETED,
    ACTIVE = Statuses.ACTIVE,
    FINISHED = Statuses.FINISHED
}