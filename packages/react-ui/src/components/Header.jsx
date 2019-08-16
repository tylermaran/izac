// Importing Dependencies
import React from 'react';
import { Link } from 'react-router-dom';

// Importing styling
import './Header.css'
const Header = (props) => {

    return (
            <div className="header">

                <div className="nav nav_menu">
                    <Link to='/order'>Menu</Link>
                </div>
                
                <div className="nav nav_settings">
                    <Link to='/settings'>Settings</Link>
                </div>

                    <div className="inner_tan">
                        <div className="inner_red">
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
     
            </div>
    )
}

export default Header;
