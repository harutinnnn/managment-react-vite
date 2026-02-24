import { Routes, Route } from "react-router-dom";
import ProtectedLayout from "@/layouts/ProtectedLayout";
import AuthLayout from "@/layouts/AuthLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

import Login from "@/pages/Login";
import Home from "@/pages/Home";
import Projects from "@/pages/Projects";
import Tasks from "@/pages/Tasks";
import Members from "@/pages/Members";
import Messages from "@/pages/Messages";
import Settings from "@/pages/Settings";

function App() {
    const isAuthenticated = !!localStorage.getItem("token");

    return (
        <Routes>
            {/* Public layout */}
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
            </Route>

            {/* Protected layout */}
            <Route
                element={
                    <ProtectedRoute>
                        <ProtectedLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/members" element={<Members />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/settings" element={<Settings />} />
            </Route>
        </Routes>
    );
}

export default App;