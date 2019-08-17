// Importing Dependencies
import React from 'react';
import { Link } from 'react-router-dom';

// Importing styling
import './Landing.css'

const Landing = (props) => {


    return (
        <div className="landing">
            <div className="inner_tan_landing">
                <div className="inner_red_landing">
                    <span className="rotate char1">i</span>
                    <span className="rotate char2">Z</span>
                    <span className="rotate char3">a</span>
                    <span className="rotate char4">c</span>
                    <span className="rotate char5">'</span>
                    <span className="rotate char6">s</span>
                    <span className="rotate char7">B</span>
                    <span className="rotate char8">a</span>
                    <span className="rotate char9">r</span>
                </div>
            </div>
            <Link to='/order' className="enter">
                Enter
            </Link>
        </div>
    )
    
}

export default Landing;
