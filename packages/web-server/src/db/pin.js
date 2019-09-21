const device = require('./device');

exports.add = (sqlite3_db, device_id, physical_pin_number, attached_device_id, device_action_id) => new Promise((resolve, reject) => {

  const sql = `INSERT INTO pin (
    device_id, physical_pin_number, attached_device_id, device_action_id
  ) VALUES (?, ?, ?, ?);`;

  const params = [ device_id, physical_pin_number, attached_device_id, device_action_id ];

  sqlite3_db.run(sql, params, function(error) {
    return error ? reject(error) : resolve(this);
  });
});

exports.getAllForAttachedDevice = (sqlite3_db, attached_device_id) =>
  new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM pin WHERE attached_device_id = ?';
    const params = [ attached_device_id ];
    sqlite3_db.all(sql, params, function(error, rows) {
      return error ? reject(error) : resolve(rows)
    });
  });
