import logo from "../assets/checklist.png";
import {Link} from "react-router-dom";
import {CalendarCheck, FolderOpenDot, Gauge, LogOut, Mail, Settings, UsersRound} from "lucide-react";

function Sidebar() {
    return (
        <>
            <div className={"sidebar"}>

                <div className="sidebar-header">

                    <img src={logo} alt="Logo"/>
                    <span>Manage</span>

                </div>

                <div className="sidebar-nav">
                    <ul>
                        <li>
                            <Link to={'/'} className={"active"}>
                                <Gauge size={22} />
                                <span>Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={'/projects'}>
                                <FolderOpenDot size={22} />
                                <span>Projects</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={'/tasks'}>
                                <CalendarCheck size={22} />
                                <span>Tasks</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={'/messages'}>
                                <Mail size={22} />
                                <span>Messages</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={'/members'}>
                                <UsersRound size={22} />
                                <span>Members</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={'/settings'}>
                                <Settings size={22} />
                                <span>Settings</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={'/logout'}>
                                <LogOut size={22} />
                                <span>Logout</span>
                            </Link>
                        </li>
                    </ul>
                </div>


            </div>
        </>
    );
}

export default Sidebar;