import React, {useEffect} from "react";
import './TaskComments.css'
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "quill-mention/dist/quill.mention.css";
import {Alerts} from "@/components/Alerts";
import {addComment, deleteComment, editComment, getComments} from "@/api/comment.api";
import {Comment} from "@/types/Comment";
import {formatDate} from "@/helpers/date.heper";
import Quill from "quill";
import {Mention, MentionBlot} from "quill-mention";
import {useRef} from "react";
import {DeleteConfirmation} from "@/components/DeleteConfirmation";

Quill.register("modules/mention", Mention);
Quill.register(MentionBlot);


type TaskCommentProps = {
    taskId: number,
    cb: () => void;
}


export const TaskComments: React.FC<TaskCommentProps> = ({cb, taskId}) => {

    const commentsRef = useRef<HTMLDivElement>(null);

    const scrollTop = () => {
        commentsRef.current?.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const [loading, setLoading] = React.useState(true);

    const [comment, setComment] = React.useState<string>("");
    const [error, setError] = React.useState<string | null>(null);
    const [confirmCommentId, setConfirmCommentId] = React.useState<number | null>(null);


    const [commentsList, setCommentsList] = React.useState<Comment[] | []>([]);

    const handleGetComments = async (taskId: number) => {

        const comments: Comment[] = await getComments(taskId)
        setCommentsList(comments)
        scrollTop()
    }

    useEffect(() => {

        (async () => {
            await handleGetComments(taskId)
            setLoading(false);
        })()

    }, [setCommentsList]);


    const modules = {
        toolbar: {
            container: [
                [{header: [1, 2, false]}],
                ["bold", "italic", "underline", "strike"],
                [{align: []}],
                ["link"],
                [{list: "ordered"}, {list: "bullet"}],
                ["clean"]
            ]
        }
    };


    const handleSendComment = async () => {

        if (!comment.length) {
            setError("Test is empty!");
        }

        try {

            await addComment({
                taskId: taskId,
                content: comment
            })

            setComment("")

            handleGetComments(taskId)

            cb()

        } catch (err) {

            console.log(err)

        }
    }

    const handleConfirmDelete = async (commentId: number) => {
        try {
            await deleteComment(commentId);
            setConfirmCommentId(null);
            await handleGetComments(taskId);
            cb();
        } catch (err) {
            console.log(err)
            setConfirmCommentId(null);
        }
    };


    const [handleEditCommentId, setEditCommentId] = React.useState<number | null>(null);
    const [editCommentContent, setEditCommentContent] = React.useState<string>("");

    const handleEditComment = async (id: number, content: string) => {
        setEditCommentContent(content)
        setEditCommentId(id)
    }

    const handleUpdateComment = async (comment: Comment) => {
        await editComment({
            ...comment,
            content: editCommentContent
        })
        await handleGetComments(taskId)
        setEditCommentId(null)
        setEditCommentContent("")
    }


    if (loading) {
        return (<div>...</div>)
    }

    return (
        <div className="comments-container">
            <h3 className="mb-10">Comments</h3>
            <div className="task-comment-list" ref={commentsRef}>

                {commentsList && commentsList.map((comment: Comment) => (
                    <div className={"comment-item " + (handleEditCommentId === comment.id ? "edit-comment-active" : "")}
                         key={comment.id}>
                        <div className="comment-info">
                            <div className={"comment-author"}>
                                {comment.name}
                            </div>
                            <div className={"comment-date"}>
                                {formatDate(comment.updatedAt)}
                            </div>
                        </div>

                        {
                            // (confirmCommentId !== comment.id && confirmCommentId === null) && <>
                            (handleEditCommentId !== comment.id) && <>

                                <div className="comment-content"
                                     dangerouslySetInnerHTML={{__html: comment.content}}
                                ></div>

                                <div className="comment-item-actions">


                            <span className="edit-comment" onClick={() => {
                                handleEditComment(comment.id, comment.content)
                            }}>Edit</span>
                                    <span
                                        className="delete-comment"
                                        onClick={() => {
                                            setConfirmCommentId(comment.id);
                                        }}
                                    >
                                Delete
                            </span>
                                    {confirmCommentId === comment.id && (
                                        <DeleteConfirmation
                                            message={"Are you sure you want to delete this comment?"}
                                            onCancel={() => setConfirmCommentId(null)}
                                            onConfirm={() => handleConfirmDelete(comment.id)}
                                        />
                                    )}
                                </div>
                            </>
                        }

                        {handleEditCommentId === comment.id &&
                            <div className={"comment-edit-container"}>
                                <ReactQuill
                                    modules={modules}
                                    value={editCommentContent}

                                    placeholder="Type @ to mention someone"
                                    onChange={(value) => {
                                        setEditCommentContent(value)
                                    }}
                                />
                                <div className={"cancel-comment-container"}>
                                     <span className="save-comment" onClick={async () => {
                                         await handleUpdateComment(comment)
                                     }}>Save</span>
                                    <span className="cancel-comment" onClick={() => {
                                        setEditCommentContent("")
                                        setEditCommentId(null)
                                    }}>Cancel</span>
                                </div>
                            </div>
                        }
                    </div>
                ))}

            </div>

            <div className="comment-editor">
                <ReactQuill
                    modules={modules}
                    value={comment}

                    placeholder="Type @ to mention someone"
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
