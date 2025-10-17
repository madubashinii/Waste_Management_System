import React, { useContext } from "react";
import { ResidentContext } from "../../context/ResidentContext";

const NotificationsPage = () => {
  const { notifications, setNotifications } = useContext(ResidentContext);

  // Mark a notification as read
  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.notificationId === notificationId ? { ...n, read: true } : n
      )
    );
  };

  // Filter unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Notifications</h4>
      <p className="text-muted">
        {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
      </p>
      {notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        <ul className="list-group">
          {notifications.map((n) => (
            <li
              key={n.notificationId}
              className={`list-group-item d-flex justify-content-between align-items-center ${
                !n.read ? "list-group-item-warning" : ""
              }`}
            >
              <div>
                <strong>{n.type}:</strong> {n.message}
              </div>
              {!n.read && (
                <button
                  className="btn btn-sm btn-outline-success"
                  onClick={() => markAsRead(n.notificationId)}
                >
                  Mark as Read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsPage;
