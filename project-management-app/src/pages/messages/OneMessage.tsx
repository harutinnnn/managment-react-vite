import {MessageFullType} from "@/types/MessageType";
import {formatDateTime} from "@/helpers/date.heper";
import {MemberJoinSkillType} from "@/types/MemberType";

type MessagePayload = {
    message: MessageFullType
    user: MemberJoinSkillType | null;
}

const OneMessage = ({message, user}: MessagePayload) => {

    const apiUrl: string = import.meta.env.VITE_API_URL || ""

    const senderOrReceiver = Number(message.sender.id) === Number(user?.user.id);


    return (
        <div className={"message-item " + (senderOrReceiver ? "sender" : "receiver")}>
            <div className={"message-item-inner"}>
                {!senderOrReceiver &&
                    <img className="message-user-avatar"
                         src={message.sender.avatar ? apiUrl + message.sender.avatar : (`/src/assets/avatars/${user?.user.gender}.png`)}
                         alt={message.sender.name}/>}
                <div>

                    <div className={"message-user-name"}>
                        {message.sender.name}
                    </div>

                    <div className="message-item-inner-info">
                        <div className={"message-text"}>{message.message.message}</div>
                        <div className={"message-date"}>
                            {formatDateTime((message.message.createdAt || "").toString())}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default OneMessage;