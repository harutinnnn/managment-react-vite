import {Routes, Route} from "react-router-dom";
import ProtectedLayout from "@/layouts/ProtectedLayout";
import AuthLayout from "@/layouts/AuthLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

import Auth from "@/pages/auth/Auth";
import Home from "@/pages/Home";
import Projects from "@/pages/projects/Projects";
import Members from "@/pages/members/Members";
import Messages from "@/pages/messages/Messages";
import Settings from "@/pages/Settings";
import Profile from "@/pages/profile/Profile";
import MembersEdit from "@/pages/members/MembersEdit";
import Skills from "@/pages/skils/Skills";
import Professions from "@/pages/professions/Professions";
import ActivationCode from "@/pages/ActivationCode";
import './App.css'
import {ProjectKanban} from "@/pages/projects/ProjectKanban";

import { socket } from "./socket";
import {useEffect} from "react";
import {useAuth} from "@/hooks/useAuth";
import {reconnectSocketWithFreshToken} from "@/socket";


function App() {
    const {user} = useAuth();

    useEffect(() => {
        if (!user) {
            socket.disconnect();
            return;
        }

        reconnectSocketWithFreshToken();

        // const handleSendMessage = (data: unknown) => {
        //     console.log("send_message", data);
        // };
        //
        // const handleConnect = () => {
        //     console.log("socket connected", socket.id);
        // };
        //
        // const handleConnectError = (error: Error) => {
        //     console.error("socket connect_error", error.message);
        // };
        //
        // socket.on("send_message", handleSendMessage);
        // socket.on("connect", handleConnect);
        // socket.on("connect_error", handleConnectError);
        //
        // return () => {
        //     socket.off("send_message", handleSendMessage);
        //     socket.off("connect", handleConnect);
        //     socket.off("connect_error", handleConnectError);
        // };
    }, [user]);



    return (
        <Routes>

            {/* Public layout */}
            <Route element={<AuthLayout/>}>
                <Route path="/login" element={<Auth/>}/>
            </Route>

            <Route path="/wrong-activation-code" element={<ActivationCode/>}/>

            {/* Protected layout */}
            <Route
                element={
                    <ProtectedRoute>
                        <ProtectedLayout/>
                    </ProtectedRoute>
                }
            >
                <Route path="/" element={<Home/>}/>

                <Route path="/projects" element={<Projects/>}/>
                <Route path="/project/:id" element={<ProjectKanban/>}/>
                <Route path="/members" element={<Members/>}/>
                <Route path="/members/:id" element={<MembersEdit/>}/>
                <Route path="/messages" element={<Messages socket={socket}/>}/>
                <Route path="/settings" element={<Settings/>}/>
                <Route path="/skills" element={<Skills/>}/>
                <Route path="/professions" element={<Professions/>}/>
                <Route path="/profile" element={<Profile/>}/>
            </Route>
        </Routes>
    );
}

export default App;
