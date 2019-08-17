// Importing Dependencies
import React from 'react';

// Importing styling
import './Drink.css'

const Drink = (props) => {

    return (
        <div className="drink" onClick={props.function}>
            <div className="drink_image"></div>
            <div className="drink_name">{props.name}</div>
        </div>
    )
    
}

export default Drink;
