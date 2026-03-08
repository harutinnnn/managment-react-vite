import {TaskFileType} from "@/types/TaskFileType";
import {BsFiletypePdf,BsFileEarmarkExcel,BsFileEarmarkWord} from "react-icons/bs";

export const TaskFileTypeDisplay = ({file}: { file: TaskFileType }) => {


    const handleGetFileType = (file: TaskFileType) => {

        switch (file.fileType) {

            case 'image/png':
            case 'image/jpeg':
            case 'image/svg+xml':

                return <img src={import.meta.env.VITE_API_URL + file.file}/>;

                break;

            case 'application/pdf':
                return <BsFiletypePdf size={24}/>
                break;
            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                return <BsFileEarmarkExcel size={24}/>
                break;
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                return <BsFileEarmarkWord size={24}/>
                break;
        }

    }

    return (
        <div className={"task-uploaded-file"}>
            {handleGetFileType(file)}
        </div>
    )
}