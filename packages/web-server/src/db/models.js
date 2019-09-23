const Sequelize = require('sequelize');
const Model = Sequelize.Model;

exports.init = function init(sequelize) {

  // ---
  class DeviceType extends Model {}
  DeviceType.init({
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    underscored: true,
    modelName: 'device_type'
  });

  // ---
  class Device extends Model {}
  Device.init({
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    underscored: true,
    modelName: 'device'
  });

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
    current_liters: {
      type: Sequelize.FLOAT,
      allowNull: false
    }
  }, {
    sequelize,
    underscored: true,
    modelName: 'bottle'
  });

  // ---
  class DeviceAction extends Model {}
  DeviceAction.init({
    name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    underscored: true,
    modelName: 'device_action'
  });

  // ---
  class Drink extends Model {}
  Drink.init({
    name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    underscored: true,
    modelName: 'drink'
  });

  // ---
  class Pour extends Model {}
  Pour.init({
    liters: {
      type: Sequelize.FLOAT,
      allowNull: false
    }
  }, {
    sequelize,
    underscored: true,
    modelName: 'pour'
  });

  // ---
  class Pin extends Model {}
  Pin.init({
    // physical pin number on device
    physical_pin_number: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    underscored: true,
    modelName: 'pin'
  });



  // - - - - - - - - - - -

  Device.belongsTo(DeviceType);

  Bottle.belongsTo(Device);

  Pour.belongsToMany(Drink, { through: 'drink_pour' });
  Drink.belongsToMany(Pour, { through: 'drink_pour' });

  Pour.belongsTo(Bottle);

  // device this pin belongs to
  Pin.belongsTo(Device, {as: 'Device', foreignKey: 'device_id'});
  // what device is attached to the pin?
  Pin.belongsTo(Device, {as: 'AttachedDevice', foreignKey: 'attached_device_id'});
  // what action does this device perform?
  Pin.belongsTo(DeviceAction);

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
