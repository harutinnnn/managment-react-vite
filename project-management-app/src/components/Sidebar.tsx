import logo from "../assets/checklist.png";
import {NavLink} from "react-router-dom";
import {CalendarCheck, FolderOpenDot, Gauge, LogOut, Mail, Settings, Tags, UserRound, UsersRound} from "lucide-react";
import {useAuth} from "@/context/AuthContext";
import {UserRoles} from "@/enums/UserRoles";

function Sidebar() {

    const {user} = useAuth();

    const {logout} = useAuth();
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
                            <NavLink to={'/'} className={({isActive}) => (isActive ? "active" : "")}>
                                <Gauge size={22}/>
                                <span>Dashboard</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/projects'} className={({isActive}) => (isActive ? "active" : "")}>
                                <FolderOpenDot size={22}/>
                                <span>Projects</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/tasks'} className={({isActive}) => (isActive ? "active" : "")}>
                                <CalendarCheck size={22}/>
                                <span>Tasks</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/messages'} className={({isActive}) => (isActive ? "active" : "")}>
                                <Mail size={22}/>
                                <span>Messages</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/members'} className={({isActive}) => (isActive ? "active" : "")}>
                                <UsersRound size={22}/>
                                <span>Members</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/settings'} className={({isActive}) => (isActive ? "active" : "")}>
                                <Settings size={22}/>
                                <span>Settings</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/profile'} className={({isActive}) => (isActive ? "active" : "")}>
                                <UserRound size={22}/>
                                <span>Profile</span>
                            </NavLink>
                        </li>


                        {user?.role === UserRoles.ADMIN &&
                            <li>
                                <NavLink to={'/skills'} className={({isActive}) => (isActive ? "active" : "")}>
                                    <Tags size={22}/>
                                    <span>Skills</span>
                                </NavLink>
                            </li>
                        }
                        <li>
                            <div className="nav-link " onClick={() => logout()}>
                                <LogOut size={22}/>
                                <span>Logout</span>
                            </div>
                        </li>
                    </ul>
                </div>


            </div>
        </>
    );
}

export default Sidebar;