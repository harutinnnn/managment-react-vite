import React from "react";
import './TaskComments.css'
import ReactQuill from "react-quill";
import {Alerts} from "@/components/Alerts";


type TaskCommentProps = {
    cb: () => void;
}

export const TaskComments: React.FC<TaskCommentProps> = ({cb}) => {

    const [task, setTask] = React.useState<string>("");
    const [error, setError] = React.useState<string | null>(null);

    const modules = {
        toolbar: {
            container: [
                [{header: [1, 2, false]}],
                ["bold", "italic", "underline", "strike"],
                [{align: []}],
                ["image", "link"],
                [{list: "ordered"}, {list: "bullet"}],
                ["clean"]
            ],

        }
    };


    const handleSendComment = () => {



        if (!task.length) {
            setError("Test is empty!");
        }

        console.log(task);

        cb()
    }


    return (
        <div className="comments-container">

            <div className="task-comment-list">

            </div>

            <div className="comment-editor">
                <ReactQuill
                    modules={modules}
                    value={task}
                    onChange={(value) => {

                        setTask(value)
                        if(value.length) {
                            setError(null)
                        }
                    }}
                />

                <div className="btn primary mt-10 mb-10" onClick={() => handleSendComment()}>
                    <span>Send</span>
                </div>

                {error && <Alerts text={error} type={"danger"} cb={() => setError(null)} />}
            </div>

        </div>
    )
}