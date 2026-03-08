import React, {Dispatch, SetStateAction, useMemo, useRef} from "react";
import ReactQuill from "react-quill";
import type Quill from "quill";
import "react-quill/dist/quill.snow.css";





const Editor = ({description,setDesc}: { description: string, setDesc: Dispatch<SetStateAction<string>> }) => {
    const quillRef = useRef<ReactQuill | null>(null);

    const imageHandler = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.click();

        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;

            const formData = new FormData();
            formData.append("image", file);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data: { url: string } = await response.json();

            const editor: Quill | undefined = quillRef.current?.getEditor();
            const range = editor?.getSelection();

            if (editor && range) {
                editor.insertEmbed(range.index, "image", data.url);
            }
        };
    };

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                ["bold", "italic", "underline"],
                ["link", "image"]
            ],
            handlers: {
                image: imageHandler
            }
        }
    }), []);

    return <ReactQuill ref={quillRef} modules={modules} value={description} onChange={setDesc}/>;
};

export default Editor;