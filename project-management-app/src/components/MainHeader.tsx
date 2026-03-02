import {Bell, BellDot} from "lucide-react";
import {NotificationsResponse, setUpdateNotification} from "@/api/notifications.api";
import {useEffect, useState} from "react";

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


    useEffect(() => {

        const handleBodyClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;

            let isClosePopup = true;
            if (target.classList.contains('notification-popup')) {
                isClosePopup = false;
            }

            if (target.classList.contains('header-notifications-icon')) {
                isClosePopup = false;
            }


            const closestElement = target.closest(".notification-popup");

            if (closestElement) {
                isClosePopup = false;
            }

            if (isClosePopup) {
                setShowNotifications(false);
            }
        };
        document.addEventListener("click", handleBodyClick);

        return () => {
            document.removeEventListener("click", handleBodyClick);
        };
    }, []);


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
                        if (notifications && notifications.length > 0) {
                            setShowNotifications(!showNotifications)
                        }
                    }} className={"header-notifications-icon"}/> :
                    <Bell onClick={() => {
                        if (notifications && notifications.length > 0) {
                            setShowNotifications(!showNotifications)
                        }
                    }} className={"header-notifications-icon"}/>
                }
            </div>

            <div className="notification-popup" style={{display: (showNotifications && notifications.length ? 'flex' : 'none')}}>

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