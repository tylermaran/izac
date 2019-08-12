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
