import {Outlet} from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import {MainHeader} from "@/components/MainHeader";
import {useEffect, useState} from "react";
import {getMembers} from "@/api/members.api";
import {getNotifications, NotificationsResponse} from "@/api/notifications.api";
import {Loader} from "lucide-react";

export default function ProtectedLayout() {
    const [minMaxSidebar, setMinMaxSidebar] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [notifications, setNotifications] = useState<NotificationsResponse[]>([]);

    useEffect(() => {

        (async () => {
            try {


                const notifications = await getNotifications()
                setNotifications(notifications as NotificationsResponse[]);
                setIsLoading(false);
            } catch (err) {

            }

        })()

    }, [setNotifications]);


    if(isLoading){
        return <Loader />;
    }

    return (
        <div id="wrapper" className={minMaxSidebar ? "minimised-sidebar" : ""}>
            <Sidebar/>
            <div></div>

            <div className="main-content">
                <MainHeader
                    minMaxSidebar={() => setMinMaxSidebar((prev) => !prev)}
                    notifications={notifications}

                />

                <div className="content-inner">
                    <Outlet/>
                </div>
            </div>
        </div>
    );
}