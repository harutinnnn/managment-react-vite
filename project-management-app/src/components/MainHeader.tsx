import {Bell, BellDot} from "lucide-react";
import {NotificationsResponse, setUpdateNotification} from "@/api/notifications.api";
import {useState} from "react";

export const MainHeader = (
    {minMaxSidebar, notifications, updateNotificationList}: {
        minMaxSidebar: () => void,
        notifications: NotificationsResponse[],
        updateNotificationList: () => void
    }
) => {


    const [showNotifications, setShowNotifications] = useState<boolean>(false);
    const handleClick = () => {
        minMaxSidebar()
    }


    const handleSetViewedNotification = async (id: number) => {

        await setUpdateNotification({id: id})
        updateNotificationList();
    }

    return (
        <div className={'main-header'}>

            <div className={"burger sidebar-burger"} onClick={() => handleClick()}>
                <div/>
                <div/>
                <div/>
            </div>


            <div className={"header-notifications " + (showNotifications ? 'active' : '')}>
                {notifications && notifications.length ?
                    <BellDot onClick={() => {
                        setShowNotifications(!showNotifications)
                    }}/> :
                    <Bell onClick={() => {
                        setShowNotifications(!showNotifications)
                    }}/>
                }
            </div>

            <div className="notification-popup" style={{display: (showNotifications ? 'flex' : 'none')}}>

                {notifications && notifications.map((notification, index) => (

                    <div className={"notify-item"} key={notification.id} onClick={() => {
                        handleSetViewedNotification(notification.id);
                    }}>
                        {index + 1}. {notification.message}
                    </div>

                ))}

            </div>

        </div>
    )
}