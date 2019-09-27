const path = require('path');
const migrate = require('migrate');

exports.load = (migrationsDirectory, stateStore) => new Promise((resolve, reject) => {
  migrate.load({
    stateStore,
    migrationsDirectory
  }, function (error, set) {
    if (error) {
      return reject(error);
    }

    set.up(function (error) {
      if (error) {
        return reject(error);
      }

      return resolve();
    });
  });
});
