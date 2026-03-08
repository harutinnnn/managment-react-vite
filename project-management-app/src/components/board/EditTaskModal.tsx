import React, {useEffect, useState} from 'react';
import './Modal.css';
import {formatDateOnly} from "@/helpers/date.heper";
import {Task} from "@/types/Task";
import {Priorities} from "@/enums/Priorities";
import {capitalize} from "@/helpers/text.helper";
import {MemberJoinSkillType} from "@/types/MemberType";
import {ConfirmPopup} from "@/context/ConfirmPopup";
import Select, {MultiValue} from "react-select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {Attachemnts} from "@/components/board/modules/Attachemnts";
import Editor from "@/components/board/modules/Editor";

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
    const [assignee, setAssignee] = useState<number[]>(task.assignee || []);

    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [deleteTask, setDeleteTask] = useState<Task | null>(null)
    const cancelDeleteColumnCancelDelete = () => {
        setShowConfirmPopup(false)
        setDeleteTask(null)
    }

    const [selectedOptions, setSelectedOptions] = useState<MultiValue<OptionType>>([]);

    const handleChange = (selected: MultiValue<OptionType>) => {
        setAssignee(selected.map((item) => Number(item.value)));
        setSelectedOptions(selected);
    };

    const [dueDate, setDueDate] = useState(
        task.dueDate ? formatDateOnly(task.dueDate) : ''
    );

    useEffect(() => {
        setSelectedOptions(members.filter(member => task.assignee.includes(Number(member.user.id))).map(member => {
            return {
                value: member.user.id,
                label: member.user.name
            }
        }))
    }, [setSelectedOptions]);

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

    type OptionType = {
        value: string;
        label: string;
    };

    const options: OptionType[] = members.map(user => {
        return {
            value: user.user.id,
            label: user.user.name
        }
    });


    return (
        <div className="modal-overlay edit-task-modal" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Edit Task</h2>


                <div className="modal-body">
                    <div>
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
                                <Editor description={description} setDesc={setDescription}/>

                            </div>

                         {/*   <div
                                className="content-display"
                                dangerouslySetInnerHTML={{__html: description}}
                            />
*/}

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

                                <Select<OptionType, true>
                                    options={options}
                                    isMulti
                                    value={selectedOptions}
                                    onChange={handleChange}
                                    placeholder="Select technologies..."
                                />
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
                    <div className="task-right-side">
                        <Attachemnts taskId={task.id}/>
                    </div>
                </div>
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