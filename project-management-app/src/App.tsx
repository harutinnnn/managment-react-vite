import {Routes, Route} from "react-router-dom";
import ProtectedLayout from "@/layouts/ProtectedLayout";
import AuthLayout from "@/layouts/AuthLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

import Auth from "@/pages/auth/Auth";
import Home from "@/pages/Home";
import Projects from "@/pages/projects/Projects";
import Tasks from "@/pages/Tasks";
import Members from "@/pages/members/Members";
import Messages from "@/pages/Messages";
import Settings from "@/pages/Settings";
import Profile from "@/pages/profile/Profile";
import MembersEdit from "@/pages/members/MembersEdit";
import Skills from "@/pages/skils/Skills";
import Professions from "@/pages/professions/Professions";
import ActivationCode from "@/pages/ActivationCode";

function App() {


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
                <Route path="/tasks" element={<Tasks/>}/>
                <Route path="/members" element={<Members/>}/>
                <Route path="/members/:id" element={<MembersEdit/>}/>
                <Route path="/messages" element={<Messages/>}/>
                <Route path="/settings" element={<Settings/>}/>
                <Route path="/skills" element={<Skills/>}/>
                <Route path="/professions" element={<Professions/>}/>
                <Route path="/profile" element={<Profile/>}/>
            </Route>
        </Routes>
    );
}

export default App;