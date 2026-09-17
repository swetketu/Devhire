import { useEffect, useState } from "react";
import api from "../services/api";

interface Notification {
    id: number;
    message: string;
    read: boolean;
    createdAt: string;
}

function Notifications() {

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
        fetchUnreadCount();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await api.get("/notifications");
            setNotifications(response.data);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const response = await api.get(
                "/notifications/unread-count"
            );

            setUnreadCount(response.data);
        } catch (error) {
            console.error(
                "Failed to fetch unread count:",
                error
            );
        }
    };

    const markAsRead = async (id: number) => {
        try {
            await api.put(`/notifications/${id}/read`);

            setNotifications((previous) =>
                previous.map((notification) =>
                    notification.id === id
                        ? { ...notification, read: true }
                        : notification
                )
            );

            setUnreadCount((count) =>
                count > 0 ? count - 1 : 0
            );

        } catch (error) {
            console.error(
                "Failed to mark notification as read:",
                error
            );
        }
    };

    if (loading) {
        return <h2>Loading notifications...</h2>;
    }

    return (
        <div>

            <h1>Notifications</h1>

            <h3>
                Unread: {unreadCount}
            </h3>

            {notifications.length === 0 ? (

                <p>No notifications yet.</p>

            ) : (

                notifications.map((notification) => (

                    <div key={notification.id}>

                        <p>
                            {notification.message}
                        </p>

                        <p>
                            Status:{" "}
                            {notification.read
                                ? "Read"
                                : "Unread"}
                        </p>

                        {!notification.read && (
                            <button
                                onClick={() =>
                                    markAsRead(notification.id)
                                }
                            >
                                Mark as Read
                            </button>
                        )}

                        <hr />

                    </div>

                ))
            )}

        </div>
    );
}

export default Notifications;