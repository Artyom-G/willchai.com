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
                    <h1>Experiences</h1>
                    <p>
                        <b>McMaster University {'\n'}</b>
                        I hold the positions:  VP of Cinematography and Head of Videography in McMaster's biggest clubs, and have shot both photo and video for various concerts, films, musical productions, and beyond.{'\n'}{'\n'}
                        <b>Real Estate{'\n'}</b>
                        Shot images and walk-throughs primarily for private homes in Ontario, and was associated with Foxwood Homes (London). {'\n'}{'\n'}
                        <b>Medium length film: “Murder of Minus”{'\n'}</b>
                        I was the Director of Photography and Cinematographer for the entire production of this original film.{'\n'}{'\n'}
                        <b>Familiar with:{'\n'}</b>
                        Stills, video/film, promotional, and spatial 3D immersive.{'\n'}
                        </p>
                </div>
            </div>
        </div>
    );
}
