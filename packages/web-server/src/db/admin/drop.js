/**
   function drop
   ================================================================================

   This function drops our database. It assumes that we're free to wreck
   any and all data in there. Use with caution lol.

   `db instanceof Database`
 */
module.exports = async function drop(db) {
  const {
    DeviceType, DeviceAction, Device, Pin,
    Bottle, Pour, Drink
  } = db.models;

  await DeviceType.drop();
  await DeviceAction.drop();
  await Device.drop();
  await Pin.drop();
  await Bottle.drop();
  await Pour.drop();
  await Drink.drop();
};
