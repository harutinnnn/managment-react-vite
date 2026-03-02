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
}


export const KanbanCard: React.FC<KanbanCardProps> = ({
                                                          task,
                                                          index,
                                                          onEdit
                                                      }) => {

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
                    </div>

                    <div className="card-created">
                        <small>Created: {task.createdAt ? formatDate(task.createdAt) : ""}</small>
                    </div>
                </div>
            )}
        </Draggable>
    );
};