//
// @TODO: clean up console.log's / verbose comments in this file! (sorry)
//

// Importing Dependencies
import React, { useState, useEffect } from 'react';
import API from 'barbot-api';

// Importing styling
import './Order.css'

// Initialize our API to point to our backend's "base url"
//
// This "API" class can be looked at in the `barbot-api` package
const api = new API('http://localhost:5000');

const Order = (props) => {

    // React Hooks Reference:
    //
    // https://reactjs.org/docs/hooks-reference.html#useeffect
    //
    const [drinks, setDrinks] = useState([]);

    useEffect(() => {
        api.drink.list().then(data => {
            console.log(JSON.stringify(data, null, 4));
            setDrinks(data.drinks)
        });
    }, []);

    let order = async (drink) => {
        // Print out what we are ordering
        console.log('Ordering a ' + drink.name);

        // Make the network request.
        //
        // THIS BLOCKS UNTIL FINISHED
        const data = await api.drink.pour(drink.id);

        // i.e. we don't print this out until the
        // robot is done pouring the drink :)
        console.log(JSON.stringify(data, null, 4));
    };

    return (
        <div className='order'>

            <div className="header">
                <h1>Bender's Bar</h1>
            </div>

            <div className="menu">

                <h2>Order a Drink</h2>

                <>{drinks.map(drink => (
                    <div className="drink" onClick={() => order(drink)}>
                        <div className="drink_name">{ drink.name }</div>
                    </div>
                ))}</>

            </div>
        </div>
    );
}

export default Order;
