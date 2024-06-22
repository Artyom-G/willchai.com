import React from "react";
import "./Home.scss";

export const Home = () => {
    return (  
        <div className="container-home">
            <img src={require('../assets/profile.jpg')} alt="william chai" />
            <h1>hey I'm Will</h1>
            <h2>a level 2 Health Sciences Student @McMaster</h2>
        </div>
    );
}
