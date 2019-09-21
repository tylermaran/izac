const Sequelize = require('sequelize');

exports.init = function init(sequelize) {

  const models = {};

  // ---
  class DeviceType extends Sequelize.Model {}
  models.DeviceType = DeviceType;
  DeviceType.init({
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'device_type'
  });

  // ---
  class Device extends Sequelize.Model {}
  models.Device = Device;
  Device.init({
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    device_type_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: DeviceType, key: 'id' }
    }
  }, {
    sequelize,
    modelName: 'device'
  });


  // ---
  class Bottle extends Sequelize.Model {}
  models.Bottle = Bottle;
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
    modelName: 'bottle'
  });

  Bottle.hasOne(Device);

  // ---
  class DeviceAction extends Sequelize.Model {}
  models.DeviceAction = DeviceAction;
  DeviceAction.init({
    name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'device_action'
  });


  // ---
  class Drink extends Sequelize.Model {}
  models.Drink = Drink;
  Drink.init({
    name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'drink'
  });

  // ---
  class DrinkPour extends Sequelize.Model {}
  models.DrinkPour = DrinkPour;
  DrinkPour.init({
    liters: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    drink_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: Drink, key: 'id' }
    },
    bottle_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: Bottle, key: 'id' }
    }
  }, {
    sequelize,
    modelName: 'drink_pour'
  });

  // ---
  class Pin extends Sequelize.Model {}
  models.Pin = Pin;
  Pin.init({
    // physical pin number on device
    physical_pin_number: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true
    },
    // device this pin belongs to
    device_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: Device, key: 'id' }
    },
    // what device is attached to the pin?
    attached_device_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: Device, key: 'id' }
    },
    device_action_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: DeviceAction, key: 'id' }
    }
  }, {
    sequelize,
    modelName: 'pin'
  });


  // - - - - - - - -  - - -
  return models;
}
