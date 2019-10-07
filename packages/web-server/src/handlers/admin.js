const { firePin } = require('../robots');


exports.pins = {};

exports.pins.fire = (pinServerPort) => async (req, res) => {
  const { pin } = req.params;
  const { sleep_ms, output } = req.body;

  try {
    await firePin(pinServerPort, pin, sleep_ms, output);
  } catch (error) {
    const id = `${Date.now()}-${Math.round(Math.random() * 9999) + 1000}`;
    res.status(500).json({ id, error: "internal server error" });
    console.error(id, error);
  }

  return res.status(204).end();
};
