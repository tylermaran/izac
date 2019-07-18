const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

module.exports = class Server {
  constructor(port, options = {
    cors: {
      origin: true,
      credentials: true,
      allowedHeaders: ['Content-Type']
    }
  }) {
    this.server;
    this.port = port;

    this.app = express();

    this.app.use(cors(options.cors));
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());

    configureRoutes(this.app);

    if (process.env.NODE_ENV === 'production') {
      // Serve any static files
      this.app.use(express.static(path.join(__dirname, '..', 'client/build')));
      // Handle React routing, return all requests to React app
      this.app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, '..', 'client/build', 'index.html'));
      });
    }
  }

  async start() {
    return new Promise(r => this.server = this.app.listen(this.port, r));
  }

  async stop() {
    return new Promise(r => this.server.close(r));
  }
}

function configureRoutes(app) {

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

}
