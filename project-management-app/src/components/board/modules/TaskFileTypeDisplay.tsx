import {TaskFileType} from "@/types/TaskFileType";
import {FileText} from "lucide-react";

export const TaskFileTypeDisplay = ({file}: { file: TaskFileType }) => {


    const handleGetFileType = (file: TaskFileType) => {

        switch (file.fileType) {

            case 'image/png':
            case 'image/jpeg':
            case 'image/svg+xml':

                return <img src={import.meta.env.VITE_API_URL + file.file}/>;

                break;

            case 'application/pdf':
            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                return <FileText string={32}/>
        }

    }

    return (
        <div className={"task-uploaded-file"}>
            {handleGetFileType(file)}
        </div>
    )
}