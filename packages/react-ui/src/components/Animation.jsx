// Importing Dependencies
import React from 'react';

// Importing styling
import './Animation.css'

const Animation = (props) => {    
    
    const pour_animation = {
        animationDuration: props.time + 's'
    }

    const straw_animation = {
        animationDelay: props.time - 2 + 's'
    }


    return (
        <div className="fill_animation">
            <div className="straw" style={straw_animation} ></div>
            <div className="cup">
                <div className="liquid" style={pour_animation}></div>
            </div>
        </div>
    )
}

export default Animation;
