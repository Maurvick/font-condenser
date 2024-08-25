const path = require('path');

const PYTHON_PATH = path.join(
  __dirname,
  '../FontForgeBuilds',
  'bin',
  'ffpython'
);

module.exports = { PYTHON_PATH };
