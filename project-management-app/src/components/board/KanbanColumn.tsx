// components/KanbanColumn.tsx
import React from 'react';
import {Droppable, Draggable} from '@hello-pangea/dnd';
import {KanbanCard} from './KanbanCard';
import './KanbanColumn.css';
import {Column} from "@/types/Column";
import {Task} from "@/types/Task";

interface KanbanColumnProps {
    column: Column;
    tasks: Task[];
    index: number;
    onAddTask: () => void;
    onEditTask: (taskId: number, columnId: number) => void;  // New prop
    onDeleteTask: (taskId: number) => void;
    onDeleteColumn: () => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
                                                              column,
                                                              tasks,
                                                              index,
                                                              onAddTask,
                                                              onEditTask,
                                                              onDeleteTask,
                                                              onDeleteColumn
                                                          }) => {
    return (
        <Draggable draggableId={`column-${column.id}`} index={index}>
            {(provided, snapshot) => (
                <div
                    className={`kanban-column ${snapshot.isDragging ? 'dragging' : ''}`}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                >
                    <div className="column-header" {...provided.dragHandleProps}>
                        <h3>{column.title}</h3>
                        <div className="column-actions">
                            <span className="task-count">{tasks.length}</span>
                            <button
                                className="delete-column-btn"
                                onClick={onDeleteColumn}
                                title="Delete column"
                            >
                                ×
                            </button>
                        </div>
                    </div>

                    <Droppable droppableId={`column-${column.id}`} type="task" isDropDisabled={snapshot.isDragging}>
                        {(provided, snapshot) => (
                            <div
                                className={`task-list ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                <div className="task-list-inner">
                                    {tasks.map((task, index) => (
                                        <KanbanCard
                                            key={`task-${task.id}`}
                                            task={task}
                                            index={index}
                                            onEdit={() => onEditTask(task.id, column.id)}  // Pass edit handler
                                            onDelete={() => onDeleteTask(task.id)}
                                        />
                                    ))}
                                    {provided.placeholder}
                                </div>

                                <button className="add-task-btn" onClick={onAddTask}>
                                    + Add Task
                                </button>
                            </div>
                        )}
                    </Droppable>
                </div>
            )}
        </Draggable>
    );
};