const Sequelize = require('sequelize');

module.exports = class Database {
  constructor(sqlite3_db_filepath) {

    const sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: sqlite3_db_filepath
    });

    const dbModuleNames = [
      'device_type', 'device_action', 'device', 'pin',
      'bottle',
      'drink', 'drink_pour',
    ];

    // The cryptic code below creates closures that apply our sequelize
    // instance to all db modules. This cleans up our External (public)
    // API so we don't have to pass sequelize for every call.
    for (let moduleName of dbModuleNames) {
      const mod = require(`./${moduleName}`);

      mod.init(sequelize);

      this[moduleName] = {};

      for (let key in mod) {
        this[moduleName][key] = function () {
          return mod[key].apply(null, [ sequelize, ...arguments ]);
        };
      }
    }
  }
}
