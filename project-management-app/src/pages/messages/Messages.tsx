import {Search, Send} from "lucide-react";
import './Messages.css'
import {useEffect, useRef, useState} from "react";
import {MemberJoinSkillType} from "@/types/MemberType";
import {getMembers} from "@/api/members.api";
import {PageInnerLoader} from "@/components/PageInnerLoder";
import {getMeRequest} from "@/api/auth.api";
import {getMemberMessages, sendMessage} from "@/api/messages.api";
import {MessageFullType} from "@/types/MessageType";
import {reconnectSocketWithFreshToken} from "@/socket";
import typingIcon from "../../assets/icons/3-dots-bounce.svg";
import OneMessage from "@/pages/messages/OneMessage";
import {useOutletContext} from "react-router-dom";
import type {ProtectedLayoutContext} from "@/layouts/ProtectedLayout";
import clickSound from "../../assets/sounds/message-sound.wav";

let typingTimeout: ReturnType<typeof setTimeout> | null = null;


const Messages = () => {
    const {socket} = useOutletContext<ProtectedLayoutContext>();

    const [loading, setLoading] = useState<boolean>(true);

    const apiUrl: string = import.meta.env.VITE_API_URL || ""

    const [members, setMembers] = useState<MemberJoinSkillType[]>([]);
    const [activeUser, setactiveUser] = useState<MemberJoinSkillType | null>(null);

    const [user, setUser] = useState<MemberJoinSkillType | null>(null);


    const [messageText, setMessageText] = useState("");

    const [activeMemberMessages, setActiveMemberMessages] = useState<MessageFullType[]>([]);

    const bottomRef = useRef<HTMLDivElement | null>(null);

    const [usersTyping, setUsersTyping] = useState<number[]>([]);


    const playSound = () => {
        const audio = new Audio(clickSound);
        audio.play().catch((err) => {
            console.error("Audio play failed:", err);
        });
    };


    useEffect(() => {
        const handleSendMessage = (data: MessageFullType) => {

            if (activeUser) {

                setActiveMemberMessages(prevState => [...prevState, data])
                setTimeout(() => bottomRef.current?.scrollIntoView({behavior: "smooth"}))

                playSound()
            }

        };


        const handleTyping = (data: { typingUser: number }) => {

            setUsersTyping(prev =>
                prev.includes(data.typingUser) ? prev : [...prev, data.typingUser]
            );
        };

        const handleStopTyping = (data: { typingUser: number }) => {
            setUsersTyping(prev => prev.filter(id => id !== data.typingUser));
        };

        socket.on("send_message", handleSendMessage)
        socket.on("typing", handleTyping)
        socket.on("stop typing", handleStopTyping)

        return () => {
            socket.off("send_message", handleSendMessage);
            socket.off("typing", handleTyping);
            socket.off("stop typing", handleStopTyping);
        };
    }, [socket, activeUser]);

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

                if (!socket.connected) {
                    reconnectSocketWithFreshToken();
                }

                socket.emit("send_message", {
                    message: messageText,
                    userId: Number(activeUser.user.id),
                    id: responseMessage.id
                })


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
                    <h4>Member Conversations</h4>

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

                                <div
                                    className={"message-member-avatar " + (usersTyping.includes(Number(member.user.id)) ? "pulse-glow" : "")}>
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

                        {activeMemberMessages && activeMemberMessages.map((message: MessageFullType) =>

                            <OneMessage message={message} user={user} key={message.message.id}/>
                        )}
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
                                   onChange={(e) => {
                                       setMessageText(e.target.value)

                                       if (typingTimeout) {
                                           clearTimeout(typingTimeout)
                                       }


                                       socket.emit('typing', {
                                           typingUser: user?.user.id,
                                           userId: activeUser?.user.id,
                                       })

                                       typingTimeout = setTimeout(() => {
                                           socket.emit('stop typing', {
                                               typingUser: user?.user.id,
                                               userId: activeUser?.user.id,
                                           })
                                       }, 2000)
                                   }}/>

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
