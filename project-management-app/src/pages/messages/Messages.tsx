import {Search, Send} from "lucide-react";
import './Messages.css'
import {useEffect, useState} from "react";
import {MemberJoinSkillType} from "@/types/MemberType";
import {getMembers} from "@/api/members.api";
import {PageInnerLoader} from "@/components/PageInnerLoder";
import {getMeRequest} from "@/api/auth.api";
import {User} from "@/types/User";

const Messages = () => {

    const [loading, setLoading] = useState<boolean>(true);

    const apiUrl: string = import.meta.env.VITE_API_URL || ""

    const [members, setMembers] = useState<MemberJoinSkillType[]>([]);
    const [activeUser, setactiveUser] = useState<MemberJoinSkillType | null>(null);

    const [user, setUser] = useState<User | null>(null);


    useEffect(() => {
        (async () => {
            const members: MemberJoinSkillType[] = await getMembers()
            setMembers(members)

            const user = await getMeRequest()
            setUser(user)

            setLoading(false)
        })()
    }, [])


    const handleGetMemberConverstaion = async (member: MemberJoinSkillType) => {
        setactiveUser(member)


        //TODO get member conversation
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
                                await handleGetMemberConverstaion(member)
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

                    </div>

                    <div className={"send-message-container"}>
                        <div className="input-row">
                            <input type="text"/>
                            <button type={'button'} className={'btn primary'}>
                                <Send size={22}/>
                            </button>
                        </div>
                    </div>


                </div>

            </div>

        </>
    );
};

export default Messages;
