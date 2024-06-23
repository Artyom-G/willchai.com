import React from "react";
import "./WillchaiButton.scss";

export const WillchaiButton = () => {
    return (  
        <div className="container-willchaibutton">
            <a onClick={() => window.location.reload()}>
                <p>willchai.com</p>
            </a>
        </div>
    );
}