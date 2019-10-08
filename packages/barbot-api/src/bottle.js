exports.list = async function (baseURL) {
  const response = await fetch(`${baseURL}/bottles`);
  return response.json();
};

exports.one = async function(baseURL, id) {
  const response = await fetch(`${baseURL}/bottles/${id}`);
  return response.json();
};

exports.add = async function(baseURL, name, max_liters, attached_device_id) {
  const response = await fetch(`${baseURL}/bottles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, max_liters, attached_device_id})
  });

  return response.json();
};

exports.refill = async function(baseURL, id) {
  const response = await fetch(`${baseURL}/bottles/${id}/refill`, {
    method: 'POST'
  });

  return response.json();
};

exports.setFill = async function(baseURL, id, fill) {
  const response = await fetch(`${baseURL}/bottles/${id}/set-fill`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, fill })
  });

  return response.json();
};
