import type { Task } from "./Task.ts";
import type { Column } from "./Column.ts";

export interface KanbanData {
    tasks: Task[];
    columns: Column[];
}