import './Resume.scss';
const resume = require("../assets/resume.pdf");

export const Resume = () => {
    return ( 
        <div className='page'>
            <div className='page__resumePdf'>
                <embed src={resume} type="application/pdf"/>
            </div>
        </div>
    );
}