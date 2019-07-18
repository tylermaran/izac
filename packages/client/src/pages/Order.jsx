// Importing Dependencies
import React from 'react';

// Importing styling
import './Order.css'

const Order = (props) => {

    let order = (drink) => {
        console.log('Ordering a ' + drink);
        fetch('http://localhost:5000/order/' + drink, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            // credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrer: 'no-referrer',
            // body: JSON.stringify(data)
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(JSON.stringify(data));
        });
    }


    return (
        <div className='order'>
            <div className="header">
                <h1>Bender's Bar</h1>
            </div>
            <div className="menu">
                <h2>
                    Order a Drink
                </h2>
                
                <div className="drink" onClick={()=> order('Margarita')}>
                    <div className="drink_name">Margarita</div>
                </div>
                <div className="drink" onClick={()=> order('Whiskey')}>
                    <div className="drink_name">Whiskey</div>
                </div>
                

            </div>
        </div>
    );
}
  
export default Order;