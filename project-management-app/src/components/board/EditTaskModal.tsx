import React, {useState} from 'react';
import './Modal.css';
import {formatDateOnly} from "@/helpers/date.heper";
import {Task} from "@/types/Task";
import {Priorities} from "@/enums/Priorities";
import {capitalize} from "@/helpers/text.helper";
import {MemberJoinSkillType} from "@/types/MemberType";
import {ConfirmPopup} from "@/context/ConfirmPopup";
import {MyDropDownMultipleSelect} from "@/components/my-drop-down-commponent/MyDropDownMultipleSelect";


interface EditTaskModalProps {
    task: Task;
    onClose: () => void;
    onUpdate: (updatedTask: Task) => void;
    members: MemberJoinSkillType[],
    onDeleteTask: (taskId: number, columnId: number) => void;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({
                                                                task,
                                                                onClose,
                                                                onUpdate,
                                                                members,
                                                                onDeleteTask
                                                            }) => {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [priority, setPriority] = useState<Task['priority']>(task.priority);
    const [assignee, setAssignee] = useState<number | null>(task.assignee || null);

    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [deleteTask, setDeleteTask] = useState<Task | null>(null)
    const cancelDeleteColumnCancelDelete = () => {
        setShowConfirmPopup(false)
        setDeleteTask(null)
    }


    console.log(task.dueDate ? formatDateOnly(task.dueDate) : '')

    const [dueDate, setDueDate] = useState(
        // task.dueDate ? task.dueDate.toISOString().split('T')[0] : ''
        task.dueDate ? formatDateOnly(task.dueDate) : ''
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const updatedTask: Task = {
            ...task,
            title,
            description,
            priority,
            assignee: assignee,
            dueDate: dueDate ? new Date(dueDate) : null,
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
                        <MyDropDownMultipleSelect

                            list={[
                                {
                                    key: 1,
                                    value: "Gago"
                                },
                                {
                                    key: 2,
                                    value: "Sasun"
                                }
                            ]}/>
                        <select
                            value={assignee?.toString()}
                            onChange={e => setAssignee(Number(e.target.value))}
                        >
                            <option value={0} key={0}>Select member optional</option>
                            {members && members.map(member => (
                                <option value={member.user.id} key={member.user.id}>{member.user.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={() => {
                            setDeleteTask(task);
                            setShowConfirmPopup(true);
                        }
                        } className="remove-btn">
                            Delete
                        </button>

                        <button type="button" onClick={onClose} className="cancel-btn">
                            Cancel
                        </button>
                        <button type="submit" className="submit-btn">
                            Update Task
                        </button>
                    </div>
                </form>
            </div>

            {showConfirmPopup && (
                <ConfirmPopup
                    message="Are you sure you want to delete this item?"
                    onConfirm={async () => {
                        if (deleteTask) {
                            onDeleteTask(deleteTask.id, deleteTask.columnId)
                            setTimeout(() => {
                                setDeleteTask(null)
                            }, 1000)
                        }
                    }}
                    onCancel={cancelDeleteColumnCancelDelete}
                />
            )}
        </div>
    );
};