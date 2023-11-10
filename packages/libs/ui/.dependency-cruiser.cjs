/** @type {import('dependency-cruiser').IConfiguration} */

const preset = require('@lyvely/configs/dependency-cruiser/.dependency-cruiser.preset');

module.exports = {
  forbidden: [...preset.forbidden],
  options: preset.options,
};
