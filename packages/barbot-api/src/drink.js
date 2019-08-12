exports.list = async function (baseURL) {
  const response = await fetch(`${baseURL}/drinks`);
  return response.json();
};

exports.one = async function(baseURL, id) {
  const response = await fetch(`${baseURL}/drinks/${id}`);
  return response.json();
};

exports.add = async function(baseURL, name, pours) {
  const response = await fetch(`${baseURL}/drinks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, pours })
  });

  return response.json();
};

exports.pour = async function(baseURL, id) {
  const response = await fetch(`${baseURL}/drinks/${id}/pour`, {
    method: 'POST'
  });

  return response.json();
};
