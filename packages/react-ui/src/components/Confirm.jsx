// Importing Dependencies
import React from 'react';

// Importing styling
import './Confirm.css'

// Importing Components
import Animation from '../components/Animation';

const Confirm = (props) => {
    console.log(props);

    return (
        <div className="confirm">
            <div className="backdrop">
                <div className="popup">
                    <div className="confirm_title">
                        Confirm Drink
                    </div>
                    {/* <div className="confirm_image"></div> */}
                    <div className="confirm_animation">
                        <Animation time = {10} />
                    </div>
                    <button type="button" className="pour_drink">Pour</button>
                </div>
            </div>
        </div>
    )
    
}

export default Confirm;
