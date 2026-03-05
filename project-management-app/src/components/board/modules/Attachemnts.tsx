import {Paperclip} from "lucide-react";

export const Attachemnts = () => {

    return (
        <div className="task-attachments-block">
            <div className="attachment-input">
                <Paperclip size={20}/>
                <span>Attachments</span>
            </div>
        </div>
    )
}