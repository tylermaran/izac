const path = require('path');

if (!process.env.DATA_DIR) {
  console.error('you must set DATA_DIR');
  process.exit(1);
}

module.exports = {
  port: process.env.WEB_SERVER_PORT || (() => {
    console.error('you must set WEB_SERVER_PORT');
    process.exit(1);
  })(),
  cors: {
    origin: true,
    credentials: true,
    allowedHeaders: ['Content-Type']
  },
  client: {
    react: {
      baseDir: process.env.REACT_BUILD_DIR || (() => {
        if (process.env.NODE_ENV === 'production') {
          console.error('you must set REACT_BUILD_DIR');
          process.exit(1);
        }

        return '/dev/null';
      })()
    }
  },
  server: {
    pin: {
      port: process.env.PIN_SERVER_PORT || (() => {
        console.error('you must set PIN_SERVER_PORT');
        process.exit(1);
      })()
    }
  },
  sqlite3: {
    filename: path.join(process.env.DATA_DIR, 'db.sqlite3')
  },
  migrations: {
    migrationsDirectory: path.join(__dirname, 'migrations'),
    stateStore: path.join(process.env.DATA_DIR, '.migrate')
  }
};
