import {Bell, BellDot} from "lucide-react";
import {NotificationsResponse, setUpdateNotification} from "@/api/notifications.api";
import {useEffect, useState} from "react";
import {socket as appSocket} from "@/socket";
import {NotificationTypesEnum} from "@/enums/NotificationTypesEnum";
import {useNavigate} from "react-router-dom";
import clickSound from "../assets/sounds/notification-sound.mp3";
export const MainHeader = (
    {minMaxSidebar, notifications, updateNotificationList, socket}: {
        minMaxSidebar: () => void,
        notifications: NotificationsResponse[],
        updateNotificationList: () => Promise<void> | void,
        socket: typeof appSocket
    }
) => {

    const navigate = useNavigate();

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

    const playNotificationSound = () => {
        const audio = new Audio(clickSound);
        audio.play().catch((err) => {
            console.error("Audio play failed:", err);
        });
    }

    useEffect(() => {
        const handleNotification = async () => {
            playNotificationSound()
            await updateNotificationList();


        };

        socket.on("send_notification", handleNotification);

        return () => {
            socket.off("send_notification", handleNotification);
        };
    }, [socket, updateNotificationList]);


    const checkNotificationType = (notification: NotificationsResponse) => {

        if (notification.types == NotificationTypesEnum.MESSAGE) {

            const additionalNodificationData = JSON.parse(notification.json);

            if (additionalNodificationData && "senderId" in additionalNodificationData) {
                navigate('/messages/' + additionalNodificationData.senderId)
            }

        }

    }

    const handleSetViewedNotification = async (notification: NotificationsResponse) => {

        checkNotificationType(notification);

        await setUpdateNotification({id: notification.id})
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

            <div className="notification-popup"
                 style={{display: (showNotifications && notifications.length ? 'flex' : 'none')}}>

                <div className={"notification-popup-inner"}>
                    {notifications && notifications.map((notification, index) => (

                        <div className={"notify-item"} key={notification.id} onClick={() => {
                            handleSetViewedNotification(notification);
                        }}>
                            {index + 1}. {notification.message}
                        </div>

                    ))}
                </div>
            </div>

        </div>
    )
}
