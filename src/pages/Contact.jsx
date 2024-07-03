import React, { useState } from "react";
import "./Contact.scss";

const Notification = ({ message }) => {
    return (
        <div className="notification">
            {message}
        </div>
    );
};

export const Contact = () => {
    const [showNotification, setShowNotification] = useState(false);

    const copyToClipboard = () => {
        const textToCopy = "me@willchai.com";
        navigator.clipboard.writeText(textToCopy);
        setShowNotification(true);
        setTimeout(() => {
            setShowNotification(false);
        }, 1000); // Hide notification after 3 seconds
    };

    return (
        <div className="container-contact">
            <div className="business-card" onClick={copyToClipboard}>
                <h1>me<i>@</i>willchai.com</h1>
                <h2>don't be a stranger</h2>
            </div>
            {showNotification && <Notification message="Email copied to clipboard!" />}
        </div>
    );
}
