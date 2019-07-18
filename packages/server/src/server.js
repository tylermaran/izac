const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

module.exports = class Server {
  constructor(options) {
    this.server;
    this.port = options.port;

    this.app = express();

    this.app.use(cors(options.cors));
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());

    configureRoutes(this.app, options.client.baseDir);
  }

  async start() {
    return new Promise(r => this.server = this.app.listen(this.port, r));
  }

  async stop() {
    return new Promise(r => this.server.close(r));
  }
}

function configureRoutes(app, clientBaseDir) {
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
    app.use(express.static(clientBaseDir));

    // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
      res.sendFile(path.join(clientBaseDir, 'index.html'));
    });
  }
}
