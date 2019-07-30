const sqlite3 = require('sqlite3');
const bottle = require('./bottle');
const drink = require('./drink');

module.exports = class Database {
  constructor(sqlite3_db_filepath) {
    this.sqlite3_db = new sqlite3.Database(sqlite3_db_filepath);

    this.bottle = {};
    Object.keys(bottle).forEach((key) =>
      this.bottle[key] = () => bottle[key].apply(
        null,
        [ this.sqlite3_db_filepath, ...arguments ]
      ));

    this.drink = {};
    Object.keys(bottle).forEach((key) =>
      this.drink[key] = () => drink[key].apply(
        null,
        [ this.sqlite3_db_filepath, ...arguments ]
      ));
  }
}
