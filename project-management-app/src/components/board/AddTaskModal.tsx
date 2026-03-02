// components/AddTaskModal.tsx
import React, {useState} from 'react';
import './Modal.css';
import {Task} from "@/types/Task";
import {Priorities} from "@/enums/Priorities";
import {capitalize} from "@/helpers/text.helper";
import {MemberJoinSkillType} from "@/types/MemberType";

interface AddTaskModalProps {
    onClose: () => void;
    onAdd: (task: Omit<Task, 'id' | 'createdAt'>) => void;
    projectId: number;
    columnId: number;
    members: MemberJoinSkillType[]
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({onClose, onAdd, projectId, columnId,members}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<Priorities>(Priorities.MEDIUM);
    const [assignee, setAssignee] = useState<number | null>(null);
    const [dueDate, setDueDate] = useState('');

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();

        onAdd({
            projectId,
            columnId,
            title,
            description,
            priority,
            assignee: assignee,
            dueDate: dueDate ? new Date(dueDate) : undefined,
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

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Priority</label>
                            <select
                                value={priority}
                                onChange={e => setPriority(e.target.value as Priorities)}
                            >
                                <option value={Priorities.LOWEST}>{capitalize(Priorities.LOWEST)}</option>
                                <option value={Priorities.LOW}>{capitalize(Priorities.LOW)}</option>
                                <option value={Priorities.MEDIUM}>{capitalize(Priorities.MEDIUM)}</option>
                                <option value={Priorities.HIGH}>{capitalize(Priorities.HIGH)}</option>
                                <option value={Priorities.HIGHEST}>{capitalize(Priorities.HIGHEST)}</option>
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

                        <select
                            value={assignee?.toString()}
                            onChange={e => setAssignee(Number(e.target.value))}
                        >
                            <option value={0} key={0}>Select member optional</option>
                            {members &&  members.map(member => (
                                <option value={member.user.id} key={member.user.id}>{member.user.name}</option>
                            ))}
                        </select>
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