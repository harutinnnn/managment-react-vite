import {Search, Send} from "lucide-react";
import './Messages.css'
import {useEffect, useRef, useState} from "react";
import {MemberJoinSkillType} from "@/types/MemberType";
import {getMembers} from "@/api/members.api";
import {PageInnerLoader} from "@/components/PageInnerLoder";
import {getMeRequest} from "@/api/auth.api";
import {User} from "@/types/User";
import {getMemberMessages, sendMessage} from "@/api/messages.api";
import {MessageType} from "@/types/MessageType";
import {formatDateTime} from "@/helpers/date.heper";

const Messages = () => {

    const [loading, setLoading] = useState<boolean>(true);

    const apiUrl: string = import.meta.env.VITE_API_URL || ""

    const [members, setMembers] = useState<MemberJoinSkillType[]>([]);
    const [activeUser, setactiveUser] = useState<MemberJoinSkillType | null>(null);

    const [user, setUser] = useState<User | null>(null);


    const [messageText, setMessageText] = useState("");

    const [activeMemberMessages, setActiveMemberMessages] = useState<MessageType[]>([]);

    const bottomRef = useRef<HTMLDivElement | null>(null);


    useEffect(() => {
        (async () => {
            const members: MemberJoinSkillType[] = await getMembers()
            setMembers(members)

            const user = await getMeRequest()
            setUser(user)

            setLoading(false)
        })()
    }, [])


    const handleGetMemberConversation = async (member: MemberJoinSkillType) => {
        setactiveUser(member)

        await handleGetMemberMessages(member)
        //TODO get member conversation
    }


    const handleGetMemberMessages = async (member: MemberJoinSkillType) => {

        const memberMessagesResponse = await getMemberMessages(Number(member?.user.id))
        setActiveMemberMessages(memberMessagesResponse)

        setTimeout(() => bottomRef.current?.scrollIntoView({behavior: "smooth"}))
    }

    const handleSetMessage = async () => {

        if (messageText.trim().length > 0 && activeUser) {

            try {

                const responseMessage = await sendMessage({
                    senderId: Number(user?.user.id),
                    receiverId: Number(activeUser.user.id),
                    message: messageText

                })

                setMessageText("")

                await handleGetMemberMessages(activeUser)

                console.log(responseMessage)


            } catch (e) {
                console.error(e)
            }

        }


    }

    if (loading) {
        return <PageInnerLoader/>;
    }

    return (
        <>
            <div className={"page-header mb-20"}>
                <h1>Messages</h1>
            </div>

            <div className={"messages-container"}>

                <div className={"message-users"}>
                    <h4>Conversations</h4>

                    <div className={"message-users-search-input input-row relative"}>
                        <Search className="search-icon" size={22}/>
                        <input type="text" placeholder="Search users..." onChange={(e) => {

                            setMembers(prevState => prevState.filter(m => m.user.name.toLowerCase().includes(e.target.value.toLowerCase())))
                        }}/>
                    </div>

                    <div className="chat-members-list">
                        {members && members.filter(m => Number(m.user.id) !== Number(user?.user.id)).map((member: MemberJoinSkillType) => (
                            <div className={"chat-member " + (activeUser?.user.id === member.user.id ? 'active' : '')}
                                 key={member.user.id} onClick={async () => {
                                await handleGetMemberConversation(member)
                            }}>

                                <div className={"message-member-avatar"}>
                                    <img className={'avatar'}
                                         src={member.user.avatar ? apiUrl + member.user.avatar : (`/src/assets/avatars/${member.user.gender}.png`)}
                                         alt="Avatar"/>

                                    <div className={"badge"}></div>
                                </div>
                                <div className={"message-member-name"}>
                                    {member.user.name}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

                <div className={"message-conversation"}>

                    <div className={"messages-list"}>

                        {activeMemberMessages && activeMemberMessages.map((message: MessageType) => (
                            <div className={"message-item " + (message.receiverId === user?.user.id ? "" : "receiver")}
                                 key={message.id}>
                                <div className={"message-item-inner"}>
                                    {message.receiverId === user?.user.id && <img className="message-user-avatar"
                                                                                  src={message.receiverAvatar ? apiUrl + message.receiverAvatar : (`/src/assets/avatars/${user?.user.gender}.png`)}
                                                                                  alt={message.receiverName}/>}
                                    <div>
                                        <div className={"message-user-name"}>{message.receiverName}</div>
                                        <div className="message-item-inner-info">
                                            <div className={"message-text"}>{message.message}</div>
                                            <div
                                                className={"message-date"}>{formatDateTime((message.createdAt || "").toString())}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={bottomRef}/>
                    </div>

                    <div className={"send-message-container"}>
                        <div className="input-row">
                            <input type="text" value={messageText} placeholder={"Put your message text"}
                                   onKeyUp={async (e) => {
                                       if (e.key === "Enter") {
                                           await handleSetMessage()
                                       }
                                   }}
                                   onChange={(e) => setMessageText(e.target.value)}/>

                            <button type={'button'} className={'btn primary'} onClick={() => handleSetMessage()}>
                                <Send size={16}/>
                            </button>
                        </div>
                    </div>


                </div>

            </div>

        </>
    );
};

export default Messages;
