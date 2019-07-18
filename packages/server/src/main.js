const Server = require('./server');

console.log(Server);

const config = {
  port: process.env.PORT || 5000
};

(async function() {
  const server = new Server(config.port)
  await server.start();
  console.log(`listening on port ${config.port}`);
})();
