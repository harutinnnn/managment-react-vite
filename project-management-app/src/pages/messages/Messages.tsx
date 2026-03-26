import {Search, Send} from "lucide-react";
import './Messages.css'
import {useEffect, useRef, useState} from "react";
import {MemberJoinSkillType, UserUnreadMessagesResponseType, UserUnreadMessagesType} from "@/types/MemberType";
import {getMembersChat} from "@/api/members.api";
import {PageInnerLoader} from "@/components/PageInnerLoder";
import {getMeRequest} from "@/api/auth.api";
import {getMemberMessages, sendMessage} from "@/api/messages.api";
import {MessageFullType} from "@/types/MessageType";
import {reconnectSocketWithFreshToken} from "@/socket";
import OneMessage from "@/pages/messages/OneMessage";
import {useOutletContext, useParams} from "react-router-dom";
import type {ProtectedLayoutContext} from "@/layouts/ProtectedLayout";
import clickSound from "../../assets/sounds/message-sound.wav";

let typingTimeout: ReturnType<typeof setTimeout> | null = null;


const Messages = () => {

    const {id} = useParams()
    const {socket} = useOutletContext<ProtectedLayoutContext>();

    const [loading, setLoading] = useState<boolean>(true);

    const apiUrl: string = import.meta.env.VITE_API_URL || ""

    const [members, setMembers] = useState<UserUnreadMessagesType[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
    const [activeUser, setActiveUser] = useState<UserUnreadMessagesType | null>(null);

    const [user, setUser] = useState<MemberJoinSkillType | null>(null);


    const [messageText, setMessageText] = useState("");

    const [activeMemberMessages, setActiveMemberMessages] = useState<MessageFullType[]>([]);

    const bottomRef = useRef<HTMLDivElement | null>(null);

    const [usersTyping, setUsersTyping] = useState<number[]>([]);

    const routeActiveUser = id
        ? members.find(member => Number(member.id) === Number(id)) ?? null
        : null;

    const selectedUser = activeUser ?? routeActiveUser;


    const playSound = () => {
        const audio = new Audio(clickSound);
        audio.play().catch((err) => {
            console.error("Audio play failed:", err);
        });
    };

    const handleGetMemberMessages = async (member: UserUnreadMessagesType) => {

        const memberMessagesResponse = await getMemberMessages(Number(member?.id))
        setActiveMemberMessages(memberMessagesResponse)

        setTimeout(() => bottomRef.current?.scrollIntoView({behavior: "smooth"}))
    }

    const handleGetMemberConversation = (member: UserUnreadMessagesType) => {
        setActiveUser(member)
        //TODO get member conversation
    }

    useEffect(() => {
        if (!selectedUser) {
            return;
        }

        let cancelled = false;

        const loadMessages = async () => {
            const memberMessagesResponse = await getMemberMessages(Number(selectedUser.id));

            if (cancelled) {
                return;
            }

            setActiveMemberMessages(memberMessagesResponse);
            setTimeout(() => bottomRef.current?.scrollIntoView({behavior: "smooth"}));
        };

        void loadMessages();

        return () => {
            cancelled = true;
        };
    }, [selectedUser?.id]);

    useEffect(() => {
        const handleSendMessage = (data: MessageFullType) => {

            if (selectedUser) {

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
    }, [socket, selectedUser]);

    useEffect(() => {
        (async () => {
            const userUnreadMessagesResponse: UserUnreadMessagesResponseType = await getMembersChat()
            setMembers(userUnreadMessagesResponse.members)
            setOnlineUsers(userUnreadMessagesResponse.onlineUsers)

            const user = await getMeRequest()
            setUser(user)

            setLoading(false)
        })()

    }, [])


    const handleSetMessage = async () => {

        if (messageText.trim().length > 0 && selectedUser) {

            try {

                const responseMessage = await sendMessage({
                    senderId: Number(user?.user.id),
                    receiverId: Number(selectedUser.id),
                    message: messageText

                })

                setMessageText("")

                await handleGetMemberMessages(selectedUser)

                if (!socket.connected) {
                    reconnectSocketWithFreshToken();
                }

                socket.emit("send_message", {
                    message: messageText,
                    userId: Number(selectedUser.id),
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

            <div className={"messages-container"}>

                <div className={"message-users"}>
                    <h4>Member Conversations</h4>

                    <div className={"message-users-search-input input-row relative"}>
                        <Search className="search-icon" size={22}/>
                        <input type="text" placeholder="Search users..." onChange={(e) => {

                            setMembers(prevState => prevState.filter(m => m.name.toLowerCase().includes(e.target.value.toLowerCase())))
                        }}/>
                    </div>

                    <div className="chat-members-list">
                        {members && members.filter(m => Number(m.id) !== Number(user?.user.id)).map((member: UserUnreadMessagesType) => (
                            <div className={"chat-member " + (selectedUser?.id === member.id ? 'active' : '')}
                                 key={member.id} onClick={async () => {
                                await handleGetMemberConversation(member)
                            }}>

                                <div
                                    className={"message-member-avatar " + (usersTyping.includes(Number(member.id)) ? "pulse-glow" : "")}>
                                    <img className={'avatar'}
                                         src={member.avatar ? apiUrl + member.avatar : (`/src/assets/avatars/${member.gender}.png`)}
                                         alt="Avatar"/>

                                    {member.unreadMessages > 0 &&
                                        <div className="member-unread-messages">{member.unreadMessages}</div>}

                                    {onlineUsers.includes(member.id) &&
                                        <div className={"badge"}></div>}
                                </div>
                                <div className={"message-member-name"}>
                                    {member.name}
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
                                           userId: selectedUser?.id,
                                       })

                                       typingTimeout = setTimeout(() => {
                                           socket.emit('stop typing', {
                                               typingUser: user?.user.id,
                                               userId: selectedUser?.id,
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
