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
    dbModuleNames.forEach(module_name => {
      const mod = require(`./${module_name}`);

      Object.keys(mod).forEach((key) => {
        if (typeof this[module_name] === 'undefined') {
          this[module_name] = {};
        }

        this[module_name][key] = function () {
          return mod[key].apply(null, [ sequelize, ...arguments ]);
        };
      });
    });
  }

}
