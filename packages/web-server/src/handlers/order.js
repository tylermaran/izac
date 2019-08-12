exports.drink = (req, res) => {
  let drink = req.params.drink;

  console.log('You got it!');
  res.status(200).json({
    message: 'You got it!',
    drink: drink
  });
};
