// components/AddTaskModal.tsx
import React, {useState} from 'react';
import './Modal.css';
import {TaskAdd} from "@/types/Task";
import {MemberJoinSkillType} from "@/types/MemberType";

interface AddTaskModalProps {
    onClose: () => void;
    onAdd: (task: TaskAdd) => void;
    projectId: number;
    columnId: number;
    members: MemberJoinSkillType[]
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({onClose, onAdd, projectId, columnId}) => {
    const [title, setTitle] = useState('');

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();

        onAdd({
            projectId,
            columnId,
            title,
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Add New Task</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="cancel-btn">
                            Cancel
                        </button>
                        <button type="submit" className="submit-btn">
                            Add Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};