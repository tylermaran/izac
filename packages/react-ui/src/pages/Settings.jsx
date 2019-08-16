// Importing Dependencies
import React from 'react';

// Importing styling
import './Settings.css'

// Importing Components
import Header from '../components/Header';

const Settings = (props) => {

    return (
        <div>
            <Header/>
            <div className="setting">
                All drinks
                All bottles
                Add/Remove a drink
                Add/Remove a bottle
                Refill bottles
                Lock machine
            </div>

        </div>
    )
    
}

export default Settings;
