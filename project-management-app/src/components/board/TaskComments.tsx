import React, {useEffect} from "react";
import './TaskComments.css'
import ReactQuill from "react-quill";
import {Alerts} from "@/components/Alerts";
import {addComment, getComments} from "@/api/comment.api";
import {Comment} from "@/types/Comment";

type TaskCommentProps = {
    taskId: number,
    cb: () => void;
}

export const TaskComments: React.FC<TaskCommentProps> = ({cb, taskId}) => {

    const [loading, setLoading] = React.useState(true);

    const [comment, setComment] = React.useState<string>("");
    const [error, setError] = React.useState<string | null>(null);


    const [commentsList, setCommentsList] = React.useState<Comment[] | []>([]);


    useEffect(() => {

        (async () => {
            await handleGetComments(taskId)
            setLoading(false);
        })()

    }, [setCommentsList]);


    const handleGetComments = async (taskId: number): Promise<Comment[] | Error> => {

        const comments: Comment[] = await getComments(taskId)
        setCommentsList(comments)
    }

    const modules = {
        toolbar: {
            container: [
                [{header: [1, 2, false]}],
                ["bold", "italic", "underline", "strike"],
                [{align: []}],
                ["link"],
                [{list: "ordered"}, {list: "bullet"}],
                ["clean"]
            ],

        }
    };


    const handleSendComment = async () => {

        if (!comment.length) {
            setError("Test is empty!");
        }

        try {


            const commentResponse = await addComment({
                taskId: taskId,
                content: comment
            })

            setComment("")

            handleGetComments(taskId)

            cb()

        } catch (err) {

        }
    }


    if (loading) {
        return (<div>...</div>)
    }

    return (
        <div className="comments-container">
            <h3>Comments</h3>

            <div className="task-comment-list">

                {commentsList && commentsList.map((comment: Comment) => (
                    <div className={"comment-item"}
                         dangerouslySetInnerHTML={{__html: comment.content}}
                    ></div>
                ))}

            </div>

            <div className="comment-editor">
                <h3>Add new comment</h3>
                <ReactQuill
                    modules={modules}
                    value={comment}
                    onChange={(value) => {

                        setComment(value)
                        if (value.length) {
                            setError(null)
                        }
                    }}
                />

                <div className="btn primary mt-10 mb-10" onClick={() => handleSendComment()}>
                    <span>Send</span>
                </div>


                {error && <Alerts text={error} type={"danger"} cb={() => setError(null)}/>}
            </div>

        </div>
    )
}