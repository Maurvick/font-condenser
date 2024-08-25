const { exec } = require('child_process');
const path = require('path');

const ffpython = path.join(__dirname, '../FontForgeBuilds', 'bin', 'ffpython');

function runPythonScript(scriptPath, args = [], callback) {
  const command = `${ffpython} ${scriptPath} ${args.join(' ')}`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      callback(null, error.message);
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
    if (stdout) {
      const outputFontPath = stdout.trim();
      callback(null, outputFontPath);
    }
  });
}

module.exports = { runPythonScript };
