//
// @TODO: clean up console.log's / verbose comments in this file! (sorry)
//

// Importing Dependencies
import React, { useState, useEffect } from 'react';
import API from 'barbot-api';

// Importing Components
import Drink from '../components/Drink';
import Header from '../components/Header';
import Confirm from '../components/Confirm';

// Importing styling
import './Order.css'

// Initialize our API to point to our backend's "base url"
// This "API" class can be looked at in the `barbot-api` package
const api = new API('http://localhost:5000');

const Order  = (props) => {
    // React Hooks Reference:
    //
    // https://reactjs.org/docs/hooks-reference.html#useeffect
    //
    const [drinkList, setDrinkList] = useState([]);
    const [confirm, setConfirm] = useState(false);
    // const [drinks]

    useEffect(() => {
        api.drink.list().then(data => {
            console.log(data);
            // console.log(JSON.stringify(data, null, 4));
            setDrinkList(data.drinks)
        });
    }, []);

    const promptComfirm = (drink) => {
        // show confirm
        setConfirm(true);
        handleOrder(drink);
    }

    const handleConfirm = (drink) => {
        console.log('Yup');
    }

    let handleOrder = async (drink) => {
        // Print out what we are ordering
        console.log('Ordering a ' + drink.name);

        // Make the network request.
        //
        // THIS BLOCKS UNTIL FINISHED
        // const data = await api.drink.pour(drink.id);

        // Temp timeout
        setTimeout(()=>{
            console.log('Drink Poured');
        }, 3000);
        
        // i.e. we don't print this out until the
        // robot is done pouring the drink :)
        // console.log(JSON.stringify(data, null, 4));
    };

    return (
        <div className='order'>

            <Header/>
            {confirm? <Confirm handleConfirm = {() => handleConfirm()} closeModal = {() => setConfirm(!confirm)}/> : <div/>}

            <h2 className="order_title">Order a Drink</h2>
            
            <div className="menu">
                {drinkList.map(drink => (
                    <Drink name={drink.name} function={() => promptComfirm(drink)} key={Math.random()} />
                ))}
                <Drink name="Custom" function={() => promptComfirm('Custom')} key={Math.random()}/>
            </div>
        </div>
    );
}

export default Order;
