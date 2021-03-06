const Sequelize = require('sequelize');

exports.getAll = (models) =>
  models.Drink.findAll().then(xs => xs.map(x => x.toJSON()));

exports.getAllWithPours = (models) =>
  models.Drink.findAll({
    include: [
      {
        model: models.Pour,
        include: [
          {
            model: models.Bottle
          }
        ]
      }
    ]
  }).then(xs => xs.map(x => x.toJSON()));

exports.getById = (models, id) =>
  models.Drink.findOne({ where: { id } }).then(m => m.toJSON());

exports.getByIdWithPours = (models, id) =>
  models.Drink.findOne({
    where: { id },
    include: [
      {
        model: models.Pour,
        include: [
          {
            model: models.Bottle
          }
        ]
      }
    ]
  }).then(m => m.toJSON());

exports.getByIdWithEverything = (models, id) =>
  models.Drink.findOne({
    where: { id },
    include: [
      {
        model: models.Pour,
        include: [
          {
            model: models.Bottle,
            include: [
              {
                model: models.Device,
                include: [
                  {
                    model: models.DeviceType
                  },
                  {
                    model: models.Pin,
                    include: [
                      {
                        model: models.DeviceAction
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }).then(m => m.toJSON());


/**

   Artist: Agua sin gas by Antoine Clamaran
   Title: Dancin'

*/
