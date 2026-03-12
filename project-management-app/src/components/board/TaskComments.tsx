import React, {useEffect} from "react";
import './TaskComments.css'
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "quill-mention/dist/quill.mention.css";
import {Alerts} from "@/components/Alerts";
import {addComment, getComments} from "@/api/comment.api";
import {Comment} from "@/types/Comment";
import {formatDate} from "@/helpers/date.heper";
import Quill from "quill";
import {Mention, MentionBlot} from "quill-mention";
import {useRef} from "react";

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


    const [commentsList, setCommentsList] = React.useState<Comment[] | []>([]);


    useEffect(() => {

        (async () => {
            await handleGetComments(taskId)
            setLoading(false);
        })()

    }, [setCommentsList]);


    const handleGetComments = async (taskId: number) => {

        const comments: Comment[] = await getComments(taskId)
        setCommentsList(comments)
        scrollTop()
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
            ]
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
    const handleChange = (content: string, delta: any, source: any, editor: any) => {
        const text = editor.getText();
        const range = editor.getSelection();

        if (!range) return;

        const beforeCursor = text.substring(0, range.index);

        if (beforeCursor.endsWith("@")) {
            onMentionTrigger(range.index);
        }
    };

    const onMentionTrigger = (position: number) => {
        console.log("User typed @ at position:", position);
        // open dropdown, fetch users, etc.
    };

    return (
        <div className="comments-container">
            <h3 className="mb-10">Comments</h3>
            <div className="task-comment-list" ref={commentsRef}>

                {commentsList && commentsList.map((comment: Comment) => (
                    <div className={"comment-item"} key={comment.id}>
                        <div className="comment-info">
                            <div className={"comment-author"}>
                                {comment.name}
                            </div>
                            <div className={"comment-date"}>
                                {formatDate(comment.createdAt)}
                            </div>
                        </div>

                        <div className="comment-content"
                             dangerouslySetInnerHTML={{__html: comment.content}}
                        ></div>

                        <div className="comment-item-actions">


                            <span className="edit-comment" onClick={() => {
                            }}>Edit</span>
                            <span className="delete-comment" onClick={() => {
                            }}>Delete</span>

                        </div>


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