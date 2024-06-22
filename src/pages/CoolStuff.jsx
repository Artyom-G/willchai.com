import React from "react";
import "./CoolStuff.scss";
import lockedInImage from "../assets/LockedIn.jpg";
import mitosisMLImage from "../assets/MitosisML.jpg";

const data = {
    projects: [
        {
            name: "LockedIn",
            description: "I created a LinkedIn profile optimizer with custom GPT-4o integration. Using proven techniques to help users improve outreach.",
            image: lockedInImage
        },
        {
            name: "Mitosis ML",
            description: "Research assistant for the Mitosis ML, a Convolutional Networks app. It  identifies mitotic index from cell sample to predict cancers.",
            image: mitosisMLImage
        },
        {
            name: "LockedIn",
            description: "I created a LinkedIn profile optimizer with custom GPT-4o integration. Using proven techniques to help users improve outreach.",
            image: lockedInImage
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
                        </div>
                    );
                })
            }
        </div>
    );
}
