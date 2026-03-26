import {TaskFileType} from "@/types/TaskFileType";
import {BsFiletypePdf, BsFileEarmarkExcel, BsFileEarmarkWord} from "react-icons/bs";
import {Trash2} from "lucide-react";

export const TaskFileTypeDisplay = ({file, removeCb, showImage}: {
    file: TaskFileType,
    removeCb: (file: TaskFileType) => void,
    showImage: (imgUrl:string) => void,
}) => {


    const showLightbox = (imgUrl:string) => {
        showImage(imgUrl)
    }

    const handleGetFileType = (file: TaskFileType) => {

        switch (file.fileType) {

            case 'image/png':
            case 'image/jpeg':
            case 'image/svg+xml': {
                const imgUrl = import.meta.env.VITE_API_URL + file.file
                return <img src={imgUrl} onClick={() => {
                    showLightbox(imgUrl)
                }}/>;

                break;
            }

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
            <Trash2 className="remove-task-attachment" size={16} onClick={() => removeCb(file)}/>
            {handleGetFileType(file)}
        </div>
    )
}