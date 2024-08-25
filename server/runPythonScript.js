const { exec } = require('child_process');
const path = require('path');

const ffpython = path.join(__dirname, './FontForgeBuilds', 'bin', 'ffpython');

function runPythonScript(scriptPath, args = [], callback) {
  const command = `${ffpython} ${scriptPath} ${args.join(' ')}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return callback(error);
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return callback(new Error(stderr));
    }

    // Assuming the output font path is returned by the Python script as the last line in stdout
    const outputFontPath = stdout.trim(); // Ensure that the path is extracted correctly
    callback(null, outputFontPath);
  });
}

module.exports = { runPythonScript };
