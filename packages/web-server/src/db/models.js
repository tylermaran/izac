const Sequelize = require('sequelize');
const Model = Sequelize.Model;

exports.init = function init(sequelize) {

  const defaultModelOptions = {
    sequelize,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  };

  // ---
  class DeviceType extends Model {}
  DeviceType.init({
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    }
  }, { ...defaultModelOptions, modelName: 'device_type' });

  // ---
  class Device extends Model {}
  Device.init({
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    }
  }, { ...defaultModelOptions, modelName: 'device' });

  // ---
  class Bottle extends Model {}
  Bottle.init({
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    max_liters: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    /**
     *  A number between zero and one.
     *  0 = bottle is empty
     *  1 = bottle is full
     */
    fill: {
      type: Sequelize.FLOAT,
      allowNull: false
    }
  }, { ...defaultModelOptions, modelName: 'bottle' });

  // ---
  class DeviceAction extends Model {}
  DeviceAction.init({
    name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, { ...defaultModelOptions, modelName: 'device_action' });

  // ---
  class Drink extends Model {}
  Drink.init({
    name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, { ...defaultModelOptions, modelName: 'drink' });

  // ---
  class Pour extends Model {}
  Pour.init({
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    liters: {
      type: Sequelize.FLOAT,
      allowNull: false
    }
  }, { ...defaultModelOptions, modelName: 'pour' });

  // ---
  class Pin extends Model {}
  Pin.init({
    // physical pin number on device
    physical_pin_number: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true
    }
  }, { ...defaultModelOptions, modelName: 'pin' });



  // - - - - - - - - - - -
  //
  // NOTE: when defining new associations, make sure to define
  //       the `foreignKey` field. This is a known bug in sequilize
  //       (they don't respect the `underscored: true` setting.
  //
  // - - - - - - - - - - -

  Device.belongsTo(DeviceType, { foreignKey: 'device_type_id' });
  Device.hasMany(Pin, { foreignKey: 'device_id' });


  Bottle.belongsTo(Device,  { foreignKey: 'device_id' });

  Pour.belongsToMany(Drink, { through: 'drink_pour', foreignKey: 'drink_id' });
  Drink.belongsToMany(Pour, { through: 'drink_pour', foreignKey: 'pour_id' });

  Pour.belongsTo(Bottle, { foreignKey: 'bottle_id' });

  // device this pin belongs to
  Pin.belongsTo(Device, { as: 'Controller', foreignKey: 'controller_id' });
  // what action does this device perform?
  Pin.belongsTo(DeviceAction, { foreignKey: 'device_action_id' });

  // - - - - - - - - - - -
  return {
    DeviceType,
    Device,
    Bottle,
    DeviceAction,
    Drink,
    Pour,
    Pin
  };
}
