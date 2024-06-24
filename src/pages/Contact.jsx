import React from "react";
import "./Contact.scss";

export const Contact = () => {

    const copyToClipboard = () => {
        const textToCopy = "me@willchai.com";
        navigator.clipboard.writeText(textToCopy);
        alert("Email copied to clipboard!");
    };

    return (  
        <div className="container-contact">
            <div className="business-card" onClick={copyToClipboard}>
                <h1>me<i>@</i>willchai.com</h1>
                <h2>don't be a stranger</h2>
            </div>
        </div>
    );
}
