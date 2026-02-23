import './Members.css'
import avatar from '../assets/avatar.png'
import {MessageCircle, UserRoundPen} from "lucide-react";

const members: [] = new Array(10).fill(0)
console.log(members)

const Members = () => {
    return (<>
            <h1>Members Page</h1>

            <div className="members">

                {members.map(ele =>
                    <div className="member-item">
                        <div className="member-header">
                            <img src={avatar} alt="Avatar" className="member-avarar"/>
                            <div className={"member-header-info"}>

                                <h3>Alex Johnson</h3>
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

        </>
    );
};

export default Members;