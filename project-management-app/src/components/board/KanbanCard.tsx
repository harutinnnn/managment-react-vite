// components/KanbanCard.tsx
import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import './KanbanCard.css';
import type { Task } from "../types/Task.ts";

interface KanbanCardProps {
    task: Task;
    index: number;
    onEdit: () => void;  // New prop
    onDelete: () => void;
}

const priorityColors = {
    low: '#e9f7e1',
    medium: '#fff3cd',
    high: '#f8d7da'
};

const priorityLabels = {
    low: '🟢 Low',
    medium: '🟡 Medium',
    high: '🔴 High'
};

export const KanbanCard: React.FC<KanbanCardProps> = ({
    task,
    index,
    onEdit,
    onDelete
}) => {
    // const formatDate = (date: Date) => {
    //     return new Intl.DateTimeFormat('en-US', {
    //         month: 'short',
    //         day: 'numeric',
    //         year: 'numeric'
    //     }).format(date);
    // };
    //
    const formatDate = (date: string | Date) => {
        const d = typeof date === "string" ? new Date(date) : date;
        const pad = (n: number) => n.toString().padStart(2, "0");
        return `${pad(d.getDate())}.${pad(d.getMonth()+1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    return (
        <Draggable draggableId={`task-${task.id}`} index={index}>
            {(provided, snapshot) => (
                <div
                    className={`kanban-card ${snapshot.isDragging ? 'dragging' : ''}`}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                        ...provided.draggableProps.style,
                        borderLeft: `4px solid ${priorityColors[task.priority]}`
                    }}
                >
                    <div className="card-header">
                        <h4>{task.title}</h4>
                        <div className="card-actions">
                            <button
                                className="edit-card-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit();
                                }}
                                title="Edit task"
                            >
                                ✎
                            </button>
                            <button
                                className="delete-card-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete();
                                }}
                                title="Delete task"
                            >
                                ×
                            </button>
                        </div>
                    </div>

                    <p className="card-description">{task.description}</p>

                    <div className="card-meta">
                        <span className="card-priority">
                            {priorityLabels[task.priority]}
                        </span>

                        {task.assignee && (
                            <span className="card-assignee">
                                👤 {task.assignee}
                            </span>
                        )}
                    </div>

                    <div className="card-footer">
                        {task.tags && task.tags.length > 0 && (
                            <div className="card-tags">
                                {task.tags.map(tag => (
                                    <span key={tag} className="tag">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {task.dueDate && (
                            <div className="card-due-date">
                                📅 {formatDate(task.dueDate)}
                            </div>
                        )}
                    </div>

                    <div className="card-created">
                        <small>Created: {formatDate(task.createdAt)}</small>
                    </div>
                </div>
            )}
        </Draggable>
    );
};