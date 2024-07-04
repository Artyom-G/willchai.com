import React from "react";
import "./CoolStuff.scss";
import lockedInImage from "../assets/LockedIn.jpg";
import mitosisMLImage from "../assets/MitosisML.jpg";

const data = {
    projects: [
        {
            name: "LockedIn",
            description: "I created a LinkedIn profile optimizer with custom GPT-4o integration. Using proven techniques to help users improve outreach.",
            image: lockedInImage,
            link: "https://linkedin.com/"
        },
        {
            name: "Mitosis ML",
            description: "Research assistant for the Mitosis ML, a Convolutional Networks app. It  identifies mitotic index from cell sample to predict cancers.",
            image: mitosisMLImage,
            link: ""
        },
        {
            name: "LockedIn",
            description: "I created a LinkedIn profile optimizer with custom GPT-4o integration. Using proven techniques to help users improve outreach.",
            image: lockedInImage,
            link: ""
        }
    ]
}

export const CoolStuff = () => {
    return (  
        <div className="container-coolstuff">
            {
                data.projects.map((item, index) => {
                    return(
                        <div key={index} className="data">
                            <img src={item.image} alt={item.name} />
                            <h1>{item.name}</h1>
                            <p>{item.description}</p>
                            <a href={item.link} target="_blank" rel="noopener noreferrer"><p className="read-more">read more</p></a>
                        </div>
                    );
                })
            }
        </div>
    );
}

