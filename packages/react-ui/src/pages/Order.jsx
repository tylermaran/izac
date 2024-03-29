//
// @TODO: clean up console.log's / verbose comments in this file! (sorry)
//

// Importing Dependencies
import React, { useState, useEffect } from 'react';
// import API from 'barbot-api';
import api from './FAKE_API';

// Importing Components
import Drink from '../components/Drink';
import Header from '../components/Header';
import Confirm from '../components/Confirm';

// Importing styling
import './Order.css';

// Initialize our API to point to our backend's "base url"
// This "API" class can be looked at in the `barbot-api` package
// const api = new API(
// 	`http://localhost:${process.env.REACT_APP_WEB_SERVER_PORT}`
// );

const Order = (props) => {
	// React Hooks Reference:
	//
	// https://reactjs.org/docs/hooks-reference.html#useeffect
	//
	const [drinkList, setDrinkList] = useState([]);
	const [confirm, setConfirm] = useState(false);
	const [currentDrink, setCurrentDrink] = useState(null);
	const [drinkComplete, setDrinkComplete] = useState(false);
	const [blockUI, setBlockUI] = useState(false);
	console.log(drinkList);

	useEffect(() => {
		api.drink.list().then((data) => {
			console.log(data);
			// console.log(JSON.stringify(data, null, 4));
			setDrinkList(data.drinks);
		});
	}, []);

	const promptConfirm = (drink) => {
		console.log('2. opening the prompt', drink);

		// show confirm
		setConfirm(true);
		setDrinkComplete(false);
		setCurrentDrink(drink);
	};

	const handleConfirm = () => {
		console.log('Yup');
		return handleOrder();
	};

	let handleOrder = async () => {
		// Print out what we are ordering
		console.log('Ordering a ' + currentDrink.name);

		// Block the UI after the user hits "pour"
		setBlockUI(true);

		// Calls 'Pour' from the Barbot API
		const data = await api.drink.pour(currentDrink.id);

		// i.e. we don't print this out until the
		// robot is done pouring the drink :)
		console.log(JSON.stringify(data, null, 4));

		setTimeout(() => {
			console.log('Drink pouring done!');
			setDrinkComplete(true);
			setBlockUI(false);
		}, 5000);
	};

	return (
		<div className="order">
			{/* TODO set pour time from drink object. Can't do it from windows >.> */}
			<Header />
			{confirm ? (
				<Confirm
					pourTime={5}
					drinkComplete={drinkComplete}
					handleConfirm={() => handleConfirm()}
					closeModal={() => setConfirm(!confirm)}
				/>
			) : (
				<></>
			)}

			<h2 className="order_title">Order a Drink</h2>

			<div className="menu">
				{blockUI ? <div className="block"></div> : <></>}

				{drinkList.map((drink) => {
					console.log(drink);
					for (let pour of drink.pours) {
						if (pour.bottle.fill <= 0.05) {
							return null;
						}
					}

					return (
						<Drink
							name={drink.name}
							onClick={() => promptConfirm(drink)}
							key={Math.random()}
						/>
					);
				})}

				<Drink
					name="Custom"
					function={() => promptConfirm('Custom')}
					key={Math.random()}
				/>
			</div>
		</div>
	);
};

export default Order;
