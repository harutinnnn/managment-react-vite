import {Paperclip} from "lucide-react";
import {AxiosError} from "axios";
import {useEffect, useState} from "react";
import {addTaskFile, taskFileList} from "@/api/board.api";
import {TaskFileType} from "@/types/TaskFileType";
import {TaskFileTypeDisplay} from "@/components/board/modules/TaskFileTypeDisplay";


const allowMimes: string[] = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "image/*",
    "image/"
]


export const Attachemnts = ({taskId}: { taskId: number }) => {

    const [error, setError] = useState<string | null>();
    const [fileErrors, setFileErrors] = useState<string[]>([]);
    const [uploadedFiles, setUploadedFiles] = useState<TaskFileType[] | []>([]);

    useEffect(() => {
        (async () => {
            try {
                const taskFiles: TaskFileType[] = await taskFileList(taskId);
                setUploadedFiles(taskFiles);
            } catch (err) {
                console.log(err);
            }
        })();
    }, [taskId]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {


        if (e.target.files) {


            setError(null);
            const files = Array.from(e.target.files);

            if (!files) return;

            if (files.length) {


                files.forEach((file) => {

                    (async () => {
                        // Validate file type

                        let isFileOk = false;
                        allowMimes.forEach((mime) => {

                            if (file.type.startsWith(mime)) {
                                console.log(mime, file.type)
                                isFileOk = true;
                            }
                        })

                        console.log('isFileOk', isFileOk);

                        if (!isFileOk) {
                            setFileErrors(prevState => [...prevState, "Wrong file format " + file.name])
                            return;
                        }


                        const mb = 2;
                        // Validate file size (max 1MB)
                        if (file.size > mb * 1024 * 1024) {
                            setError(`File size must be ${mb}MB or less`);
                            return;
                        }

                        // Upload immediately
                        const formData = new FormData();
                        formData.append('taskId', taskId.toString())
                        formData.append("file", file);

                        try {

                            //TODO make file upload to back
                            const file: TaskFileType = await addTaskFile(formData);

                            setUploadedFiles(prevState => [...prevState, file])

                        } catch (err) {

                            if (err instanceof AxiosError) {
                                setError(err.response?.data?.message || "Login failed");
                            } else {
                                setError("Upload failed");
                            }
                        }
                    })()
                })
            }
        }
    }


    return (
        <div className="task-attachments-block">
            {error && (<div className="error-msg">{error}</div>)}

            <label htmlFor="task-files" className="attachment-input">
                <Paperclip size={20}/>
                <span>Attachments</span>
                <input type="file" id="task-files" className="d-none" onChange={handleFileChange} multiple
                       accept={allowMimes.join(',')}/>
            </label>

            <div>
                {fileErrors.map((error, index) => (
                    <div className={'error-msg'} key={index}>{error}</div>
                ))}
            </div>


            <div className="attachment-files">
                {uploadedFiles && uploadedFiles.map((file, index) => (

                    <TaskFileTypeDisplay file={file} key={index}/>
                ))}
            </div>
        </div>
    )
}