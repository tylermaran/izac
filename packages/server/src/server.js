const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

// Initialize Body parser to use JSON and URL Encoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const corsOptions = {
    // origin: 'http://localhost:3000',
    origin: true,
    credentials: true,
    allowedHeaders: ['Content-Type']
}

app.use(cors(corsOptions));


app.get('/', (req, res) => {
    console.log('What can I get ya?');
    res.status(200).json({
        message: 'What can I get ya?'
    });
});

app.post('/order/:drink?', (req, res) => {
    
    let drink = req.params.drink;

    console.log('You got it!');
    res.status(200).json({
        message: 'You got it!',
        drink: drink
    });

});


if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));