// BEHOLD! All the functions you need.
// Or at least all of the functions the frontend calls
// Mocked out because I couldn't get the api working

export default {
	drink: {
		list: () => {
			return new Promise((resolve) => {
				resolve({
					drinks: [
						{ name: 'Rum & Coke', pours: [] },
						{ name: 'Jamba Juice', pours: [] },
						{ name: 'REDBULL', pours: [] },
						{ name: 'Vodka Tonic', pours: [] },
					],
				});
			});
		},
		pour: () => {
			return new Promise((resolve) => {
				console.log('POUR');
				resolve();
			});
		},
	},
	bottle: {
		list: () => {
			return new Promise((resolve) => {
				resolve({
					bottles: [
						{ id: 12345, name: 'rum', max_liters: 2, fill: 1 },
						{ id: 52352, name: 'coke', max_liters: 2, fill: 0.5 },
						{ id: 52352, name: 'sprite', max_liters: 2, fill: 0.5 },
						{
							id: 12215,
							name: 'tequila',
							max_liters: 2,
							fill: 0.75,
						},
					],
				});
			});
		},
		refill: () => {
			return new Promise((resolve) => {
				console.log('REFILL');
				resolve();
			});
		},
		setFill: () => {
			return new Promise((resolve) => {
				console.log('SETFILL');
				resolve();
			});
		},
	},
};
