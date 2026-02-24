import './Members.css'
import avatar from '../../assets/avatar.png'
import {MessageCircle, UserRound, UserRoundPen, X} from "lucide-react";
import {useEffect, useState} from "react";
import Modal from "react-modal";
import {MemberForm} from "@/pages/members/MemberForm";
import {getMembers} from "@/api/members.api";


// Bind modal to your appElement (for accessibility)
Modal.setAppElement("#root");


const Members = () => {

    // const members: number[] = new Array(10).fill(0)
    const [members, setMembers] = useState([]);

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

    useEffect(() => {
        getMembersHandle()
    }, [])


    const getMembersHandle = async () => {

        try {

            const members: any = await getMembers()
            setMembers(members)

        } catch (e) {
        }


    }

    return (<>

            <div className={"page-header mb-20"}>
                <h1 className={"page-title "}>Members({members.length})</h1>
                <button className={"btn ml-auto"} onClick={() => {
                    openModal()
                }}>
                    <span>Add new</span>
                    <UserRound size={16}/>
                </button>
            </div>

            <div className="members">

                {members.map((member, i) =>
                    <div className="member-item" key={i}>
                        <div className="member-header">
                            <img src={avatar} alt="Avatar" className="member-avarar"/>
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
                                <span>emai@example.com</span>
                            </div>
                            <div>
                                <span>Role</span>
                                <span>Admin</span>
                            </div>

                        </div>

                        <div className="member-skills">

                            <div className={"member-skill"}>React</div>
                            <div className={"member-skill"}>Node.js</div>
                            <div className={"member-skill"}>TypeS</div>

                        </div>

                        <div className="member-actions">

                            <button className={"btn"}>
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