import {Bell, BellDot} from "lucide-react";
import {NotificationsResponse} from "@/api/notifications.api";
import {useState} from "react";

export const MainHeader = (
    {minMaxSidebar, notifications}: { minMaxSidebar: () => void, notifications: NotificationsResponse[] }
) => {


    const [showNotifications, setShowNotifications] = useState<boolean>(false);
    const handleClick = () => {
        minMaxSidebar()
    }

    return (
        <div className={'main-header'}>

            <div className={"burger sidebar-burger"} onClick={() => handleClick()}>
                <div/>
                <div/>
                <div/>
            </div>


            <div className={"header-notifications " + (showNotifications ? 'active' : '')}>
                {notifications?.notifications && notifications?.notifications.length ?
                    <BellDot onClick={() => {
                        setShowNotifications(!showNotifications)
                    }}/> :
                    <Bell onClick={() => {
                        setShowNotifications(!showNotifications)
                    }}/>
                }
            </div>

            <div className="notification-popup" style={{display: (showNotifications ? 'flex' : 'none')}}>

                {notifications?.notifications && notifications.notifications.map((notification, index) => (

                    <div className={"notify-item"} key={notification.id}>
                        {index + 1}. {notification.message}
                    </div>

                ))}

            </div>

        </div>
    )
}