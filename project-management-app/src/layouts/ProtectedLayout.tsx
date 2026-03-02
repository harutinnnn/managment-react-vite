import {Outlet} from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import {MainHeader} from "@/components/MainHeader";
import {useEffect, useState} from "react";
import {getMembers} from "@/api/members.api";
import {getNotifications, NotificationsResponse} from "@/api/notifications.api";
import {Loader} from "lucide-react";

export default function ProtectedLayout() {
    const [minMaxSidebar, setMinMaxSidebar] = useState<boolean>(false);

    const [notifications, setNotifications] = useState<NotificationsResponse[]>([]);

    const getNotificationsHandle = async (): Promise<void> => {
        const notifications = await getNotifications()
        setNotifications(notifications as NotificationsResponse[]);
    }


    useEffect(() => {
        (async () => {
            try {
                getNotificationsHandle()

            } catch (err) {
                console.error(err);
            }
        })()

    }, [setNotifications]);


    return (
        <div id="wrapper" className={minMaxSidebar ? "minimised-sidebar" : ""}>
            <Sidebar/>
            <div></div>

            <div className="main-content">
                <MainHeader
                    minMaxSidebar={() => setMinMaxSidebar((prev) => !prev)}
                    notifications={notifications}
                    updateNotificationList={getNotificationsHandle}

                />

                <div className="content-inner">
                    <Outlet/>
                </div>
            </div>
        </div>
    );
}