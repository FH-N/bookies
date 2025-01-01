import React, { useEffect, useState } from "react";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/notifications/")
      .then((response) => response.json())
      .then((data) => setNotifications(data.notifications));
  }, []);

  return (
    <div className="notifications">
      <h3>Notifications</h3>
      <ul>
        {notifications.map((notification) => (
          <li key={notification.id}>
            {notification.message}{" "}
            <span>{new Date(notification.timestamp).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notifications;
