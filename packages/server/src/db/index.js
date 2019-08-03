const sqlite3 = require('sqlite3');

module.exports = class Database {
  constructor(sqlite3_db_filepath) {
    const sqlite3_db = new sqlite3.Database(sqlite3_db_filepath);

    // The cryptic code below creates closures that apply our sqlite3
    // connection to all database module functions. This cleans up
    // our External API so we don't have to pass along a sqlite3 conn
    // for every call!

    [
      'bottle', 'drink', 'device', 'device_type', 'device_action', 'pin'
    ].forEach(module_name => {
      const mod = require(`./${module_name}`);

      Object.keys(mod).forEach((key) => {
        if (typeof this[module_name] === 'undefined') {
          this[module_name] = {};
        }

        this[module_name][key] = function () {
          return mod[key].apply(null, [ sqlite3_db, ...arguments ]);
        };
      });
    });
  }

}
