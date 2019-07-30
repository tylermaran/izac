const sqlite3 = require('sqlite3');
const bottle = require('./bottle');
const drink = require('./drink');

module.exports = class Database {
  constructor(sqlite3_db_filepath) {
    const sqlite3_db = new sqlite3.Database(sqlite3_db_filepath);

    // The cryptic code below creates closures and applies our sqlite3
    // connection to the underlying database functions. This cleans up
    // our External API so we don't have to pass along a sqlite3 conn
    // for every call!

    this.bottle = {};
    Object.keys(bottle).forEach((key) => this.bottle[key] = function () {
      return bottle[key].apply(null, [ sqlite3_db, ...arguments ]);
    });

    this.drink = {};
    Object.keys(bottle).forEach((key) => this.drink[key] = function () {
      return drink[key].apply(null, [ sqlite3_db, ...arguments ]);
    });
  }
}
