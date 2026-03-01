// components/EditTaskModal.tsx
import React, { useState } from 'react';
import './Modal.css';
import type {Task} from "../types/Task.ts";

interface EditTaskModalProps {
    task: Task;
    onClose: () => void;
    onUpdate: (updatedTask: Task) => void;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({
                                                                task,
                                                                onClose,
                                                                onUpdate
                                                            }) => {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [priority, setPriority] = useState<Task['priority']>(task.priority);
    const [assignee, setAssignee] = useState(task.assignee || '');
    const [dueDate, setDueDate] = useState(
        task.dueDate ? task.dueDate.toISOString().split('T')[0] : ''
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const updatedTask: Task = {
            ...task,
            title,
            description,
            priority,
            assignee: assignee || undefined,
            dueDate: dueDate ? new Date(dueDate) : undefined,
        };

        onUpdate(updatedTask);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Edit Task</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                            placeholder="Enter task title"
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={3}
                            placeholder="Enter task description"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Priority</label>
                            <select
                                value={priority}
                                onChange={e => setPriority(e.target.value as Task['priority'])}
                            >
                                <option value="low">🟢 Low</option>
                                <option value="medium">🟡 Medium</option>
                                <option value="high">🔴 High</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Due Date</label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={e => setDueDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Assignee</label>
                        <input
                            type="text"
                            value={assignee}
                            onChange={e => setAssignee(e.target.value)}
                            placeholder="Enter assignee name"
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="cancel-btn">
                            Cancel
                        </button>
                        <button type="submit" className="submit-btn">
                            Update Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};