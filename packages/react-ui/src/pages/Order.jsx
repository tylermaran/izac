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
  const [currentDrink, setCurrentDrink] = useState(null);
  const [drinkComplete, setDrinkComplete] = useState(false);

  useEffect(() => {
    api.drink.list().then(data => {
      console.log(data);
      // console.log(JSON.stringify(data, null, 4));
      setDrinkList(data.drinks)
    });
  }, []);

  const promptComfirm = (drink) => {
    console.log('2. opening the prompt', drink);

    // show confirm
    setConfirm(true);
    setCurrentDrink(drink);
  }

  const handleConfirm = () => {
    console.log('Yup');
    return handleOrder();
  }

  let handleOrder = async () => {
    // Print out what we are ordering
    console.log('Ordering a ' + currentDrink.name);


    // Calls 'Pour' from the Barbot API
    const data = await api.drink.pour(currentDrink.id);

    // setTimeout(()=>{
    //     setDrinkComplete(true);
    // }, 5000)

    // i.e. we don't print this out until the
    // robot is done pouring the drink :)
    console.log(JSON.stringify(data, null, 4));
    setDrinkComplete(true);
  };

  return (
    <div className='order'>
    
    {/* TODO set pour time from drink object. Can't do it from windows >.> */}
    <Header/>
      { confirm ? <Confirm 
                        pourTime = {5}
                        drinkComplete = {drinkComplete}
                        handleConfirm={() => handleConfirm()}
                        closeModal = {() => setConfirm(!confirm)}/> : <></>}

      <h2 className="order_title">Order a Drink</h2>

      <div className="menu">
        {drinkList.map(drink => (
          <Drink name={drink.name}
                 function={() => promptComfirm(drink)}
                 key={Math.random()} />
        ))}

        <Drink name="Custom"
               function={() => promptComfirm('Custom')}
               key={Math.random()}/>
      </div>
    </div>
  );
}

export default Order;
