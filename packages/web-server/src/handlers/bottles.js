exports.get = (db) => async (req, res) => {
  const invalidations = [];
  const { id } = req.params;

  if (typeof id !== 'string') {
    invalidations.push('missing required parameter id');
  }

  if (invalidations.length > 0) {
    res.status(400).json({ errors: invalidations });
    return;
  }

  try {
    const bottle = await db.bottle.getById(id);
    if (bottle) {
      res.status(200).json(bottle);
    } else {
      res.status(404).json({ error: 'not found' });
    }
  } catch (error) {
    const id = `${Date.now()}-${Math.round(Math.random() * 9999) + 1000}`;
    res.status(500).json({ id, error: "internal server error" });
    console.error(id, error);
  }
};

exports.getAll = (db) => async (req, res) => {
  try {
    const bottles = await db.bottle.getAll();
    if (bottles) {
      res.status(200).json({ bottles });
    } else {
      res.status(404).json({ error: 'not found' });
    }
  } catch (error) {
    const id = `${Date.now()}-${Math.round(Math.random() * 9999) + 1000}`;
    res.status(500).json({ id, error: "internal server error" });
    console.error(id, error);
  }
};

exports.refill = (db) => async (req, res) => {
  const invalidations = [];
  const { id } = req.params;

  if (typeof id !== 'string') {
    invalidations.push('missing required parameter id');
  }

  if (invalidations.length > 0) {
    res.status(400).json({ errors: invalidations });
    return;
  }

  try {
    await db.bottle.refill(id);
    const bottle = await db.bottle.getById(id);
    res.status(200).json(bottle);
  } catch (error) {
    const id = `${Date.now()}-${Math.round(Math.random() * 9999) + 1000}`;
    res.status(500).json({ id, error: "internal server error" });
    console.error(id, error);
  }
};


exports.setFill = (db) => async (req, res) => {
  const invalidations = [];
  const { id } = req.params;
  const { fill } = req.body;

  if (typeof id !== 'string') {
    invalidations.push('missing required parameter id');
  }

  if (typeof fill !== 'number') {
    invalidations.push('missing required parameter fill');
  }

  if (fill < 0 || fill > 1) {
    invalidations.push("fill must be a value 0-1");
  }

  if (invalidations.length > 0) {
    res.status(400).json({ errors: invalidations });
    return;
  }

  try {
    await db.bottle.setFill(id, fill);
    const bottle = await db.bottle.getById(id);
    res.status(200).json(bottle);
  } catch (error) {
    const id = `${Date.now()}-${Math.round(Math.random() * 9999) + 1000}`;
    res.status(500).json({ id, error: "internal server error" });
    console.error(id, error);
  }
};
