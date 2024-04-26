const resolveId = require('postcss-import/lib/resolve-id');

function resolveModuleId(id) {
  return new Promise((res, rej) => {
    try {
      const path = require.resolve(id);
      res(path);
    } catch (err) {
      rej(err);
    }
  });
}

module.exports = function (id, base, options) {
  try {
    return resolveModuleId(id);
  } catch (e) {}

  return resolveId(id, base, options);
};
