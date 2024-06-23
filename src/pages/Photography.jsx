import React from "react";
import "./Photography.scss";

export const Photography = () => {
    return (
        <div className="container-photography">
            <div className="container-photography__sections">
                <div className="container-photography__sections__section1">
                    <div>
                        <img src={require("../assets/photo1.jpg")} alt="artyom gabtraupov" className="horizontal" />
                        <img src={require("../assets/photo2.jpg")} alt="matthew patthew" className="vertical" />
                    </div>
                    <div>
                        <img src={require("../assets/photo3.jpg")} alt="pop" className="vertical" />
                        <img src={require("../assets/photo4.jpg")} alt="girls" className="horizontal" />
                    </div>
                    <a href="https://www.instagram.com/willchei" target="_blank" rel="noopener noreferrer"><p>Intersted in more?</p></a>
                </div>
                <div className="container-photography__sections__section2">
                    <h1>Experience (2021 - Present)</h1>
                    <p>
                        <b>VP of Cinematography {'\n'}</b>
                        &#x2022; McMaster Film Prod. Club {'\n'}
                        <b>Head of Videography {'\n'}</b>
                        &#x2022; Health Science Musical {'\n'}
                        <b>Camera Operator {'\n'}</b>
                        &#x2022; HSM ‘24 {'\n'}
                        &#x2022; McMaster Musical ‘24 - “Into the Woods” {'\n'}
                        <b>Photographer {'\n'}</b>
                        &#x2022; 4th Year Health Science Semi-Formal ‘24{'\n'} 
                        &#x2022; SJK High School{'\n'} 
                        &#x2022; Businesses: Foxwood Homes, Ace Shawarma & Burgers, various cafes{'\n'} 
                        <b>Real Estate Photographer{'\n'} </b>
                        &#x2022; Private homes{'\n'} 
                        <b>Director of Photography / Cinematographer{'\n'}</b>
                        &#x2022; Medium length film “Murder of Minus”{'\n'} 
                    </p>
                </div>
            </div>
        </div>
    );
}
