require('es6-promise').polyfill();
require('isomorphic-fetch');

module.exports = class API {

  constructor(baseURL) {
    [ 'bottle', 'drink' ].forEach(module_name => {
      const mod = require(`./${module_name}`);

      Object.keys(mod).forEach((key) => {
        if (typeof this[module_name] === 'undefined') {
          this[module_name] = {};
        }

        this[module_name][key] = function () {
          return mod[key].apply(null, [ baseURL, ...arguments ]);
        };
      });
    });
  }

};
