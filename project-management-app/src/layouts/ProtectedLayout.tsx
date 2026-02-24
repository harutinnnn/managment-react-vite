import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { MainHeader } from "@/components/MainHeader";
import { useState } from "react";

export default function ProtectedLayout() {
    const [minMaxSidebar, setMinMaxSidebar] = useState<boolean>(false);

    return (
        <div id="wrapper" className={minMaxSidebar ? "minimised-sidebar" : ""}>
            <Sidebar />
            <div></div>

            <div className="main-content">
                <MainHeader
                    minMaxSidebar={() => setMinMaxSidebar((prev) => !prev)}
                />

                <div className="content-inner">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}