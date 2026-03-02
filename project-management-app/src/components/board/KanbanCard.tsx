// components/KanbanCard.tsx
import React from 'react';
import {Draggable} from '@hello-pangea/dnd';
import './KanbanCard.css';
import {Task} from "@/types/Task";
import {formatDate} from "@/helpers/date.heper";

interface KanbanCardProps {
    task: Task;
    index: number;
    onEdit: () => void;  // New prop
    onDelete: () => void;
}

const priorityColors = {
    lowest: '#e9f7e1',
    low: '#e9f7e1',
    medium: '#fff3cd',
    high: '#f8d7da',
    highest: '#f8d7da'
};

const priorityLabels = {
    lowest: '🟢 Low',
    low: '🟢 Low',
    medium: '🟡 Medium',
    high: '🔴 High',
    highest: '🔴 High'
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

    return (
        <Draggable draggableId={`task-${task.id}`} index={index}>
            {(provided, snapshot) => (
                <div
                    className={`kanban-card ${task.priority} ${snapshot.isDragging ? 'dragging' : ''}`}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                        ...provided.draggableProps.style
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit();
                    }}
                >
                    <div className="card-header">
                        <h4>
                            <span>{task.title}</span>
                            <div className={"task-priority " + task.priority}/>
                        </h4>
                        <div className="card-actions">
                            {/* <button
                                className="delete-card-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete();
                                }}
                                title="Delete task"
                            >
                                ×
                            </button>*/}
                        </div>
                    </div>

                    <p className="card-description">{task.description}</p>

                    <div className="card-created">
                        <small>Created: {formatDate(task.createdAt)}</small>
                    </div>
                </div>
            )}
        </Draggable>
    );
};