exports.getAll = (models) =>
  models.Bottle.findAll().then(xs => xs.map(x => x.toJSON()));

exports.getById = (models, id) =>
  models.Bottle.findOne({ where: { id } }).then(m => m.toJSON());

exports.setFill = (models, id, fill) =>
  models.Bottle.update({ fill }, { where: { id } })

exports.refill = (models, id) =>
  models.Bottle.update({ fill: 1 }, { where: { id } })
