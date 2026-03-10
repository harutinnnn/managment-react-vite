import React, { Dispatch, SetStateAction, useCallback, useMemo, useRef, useState } from "react";
import ReactQuill from "react-quill";
import Quill from "quill";
import ImageResize from 'quill-image-resize-module-react';
import "react-quill/dist/quill.snow.css";
import { addTaskFile } from "@/api/board.api";
import { Task } from "@/types/Task";

Quill.register("modules/imageResize", ImageResize);

const Editor = ({ description, setDesc, task }: {
    description: string,
    setDesc: Dispatch<SetStateAction<string>>,
    task: Task
}) => {
    const quillRef = useRef<ReactQuill | null>(null);

    const [isEditing, setIsEditing] = useState<boolean>(false);

    const imageHandler = useCallback(() => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.click();

        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;

            const formData = new FormData();
            formData.append("file", file);
            formData.append('taskId', task.id.toString())

            const response = await addTaskFile(formData)


            const editor: Quill | undefined = quillRef.current?.getEditor();
            const range = editor?.getSelection();

            if (editor && range) {
                editor.insertEmbed(range.index, "image", import.meta.env.VITE_API_URL + response.file);
                editor.formatText(range.index, 1, 'width', '300px');
                editor.formatText(range.index, 1, 'max-width', '100%');
            }
        };
    }, [task.id]);

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ align: [] }],
                ["image", "link"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["clean"]
            ],
            handlers: {
                image: imageHandler
            }
        },
        imageResize: {
            modules: ["Resize", "DisplaySize", "Toolbar"]
        }
    }), [imageHandler]);

    return (
        <div className="editor-container">
            {isEditing ? (
                <div className="my-editor">
                    <ReactQuill
                        ref={quillRef}
                        modules={modules}
                        value={description}
                        onChange={setDesc}
                        onBlur={() => setIsEditing(false)}
                    />
                </div>
            ) : (
                <div
                    className="content-display" onClick={() => setIsEditing(true)}
                    dangerouslySetInnerHTML={{ __html: description.trim().length ? description : 'Click do write description' }}
                ></div>
            )}
        </div>
    );
};

export default Editor;