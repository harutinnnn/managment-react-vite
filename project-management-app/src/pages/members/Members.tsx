import './Members.css'
import {MessageCircle, UserRound, UserRoundPen, X} from "lucide-react";
import {useEffect, useState} from "react";
import Modal from "react-modal";
import {MemberForm} from "@/pages/members/MemberForm";
import {getMembers} from "@/api/members.api";
import {MemberType} from "@/types/MemberType";
import {useAuth} from "@/hooks/useAuth";
import {useNavigate} from "react-router-dom";
import {UserRoles} from "@/enums/UserRoles";


// Bind modal to your appElement (for accessibility)
Modal.setAppElement("#root");


const Members = () => {

    const apiUrl: string = import.meta.env.VITE_API_URL || ""

    const navigate = useNavigate();

    const {user} = useAuth();

    // const members: number[] = new Array(10).fill(0)
    const [members, setMembers] = useState<MemberType[] | []>([]);

    const [modalIsOpen, setIsOpen] = useState(false);

    const openModal = () => {
        setIsOpen(true);
    }

    const afterOpenModal = () => {
        // references are now sync'd and can be accessed.

    }


    const closeModal = () => {
        setIsOpen(false);

    }

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
    };

    const getMembersHandle = async () => {

        try {
            const members: MemberType[] = await getMembers()
            setMembers(members)
        } catch (e) {
            if (e instanceof Error) {
                console.error(e.message) // safe access
            } else {
                console.error(e) // fallback for non-Error thrown values
            }
        }
    }

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const members = await getMembers()
                setMembers(members)
            } catch (e) {
                if (e instanceof Error) console.error(e.message)
            }
        }
        fetchMembers()
    }, [])


    const getMemberProfile = async (id: number) => {
        navigate(`/members/${id}`);
    }

    return (<>

            <div className={"page-header mb-20"}>
                <h1 className={"page-title "}>Members({members.length ? members.length - 1 : 0})</h1>
                {user?.user.role === UserRoles.ADMIN &&
                    <button className={"btn ml-auto"} onClick={() => {
                        openModal()
                    }}>
                        <span>Add new</span>
                        <UserRound size={16}/>
                    </button>
                }
            </div>

            <div className="members">

                {members.filter(member => Number(member.id) !== user?.user?.id).map((member: MemberType, i) =>
                    <div className="member-item" key={i}>
                        <div className="member-header">
                            <img
                                src={member.avatar ? apiUrl + member.avatar : (`/src/assets/avatars/${member.gender}.png`)}
                                alt="Avatar" className="member-avarar"/>
                            <div className={"member-header-info"}>

                                <h3>{member.name}</h3>
                                <div className={"member-prof-status"}>
                                    <div className={"member-profession"}>Developer</div>
                                    <div className={"member-status status-active"}>Active</div>
                                </div>
                            </div>
                        </div>

                        <div className="member-info">
                            <div>
                                <span>Email</span>
                                <span>{member.email}</span>
                            </div>
                            <div>
                                <span>Phone</span>
                                <span>{member.phone}</span>
                            </div>
                            <div>
                                <span>Role</span>
                                <span>{member.role}</span>
                            </div>

                        </div>

                        <div className="member-skills">

                            <div className={"member-skill"}>React</div>
                            <div className={"member-skill"}>Node.js</div>
                            <div className={"member-skill"}>TypeS</div>

                        </div>

                        <div className="member-actions">

                            <button className={"btn"} onClick={() => getMemberProfile(Number(member.id))}>
                                <UserRoundPen size={18}/>
                                <span>Profile</span>
                            </button>
                            <button className={"btn primary"}>
                                <MessageCircle size={18}/>
                                <span>Message</span>
                            </button>

                        </div>

                    </div>
                )}
            </div>

            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >


                <X onClick={closeModal} className="close-modal"/>

                <MemberForm closeModal={() => closeModal()} getMembers={() => getMembersHandle()}/>

            </Modal>

        </>
    );
};

export default Members;