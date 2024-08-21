const { exec } = require('child_process');
const path = require('path');

const ffpython = path.join(__dirname, './FontForgeBuilds', 'bin', 'ffpython');

function runPythonScript(scriptPath, args = []) {
  const command = `${ffpython} ${scriptPath} ${args.join(' ')}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
}

module.exports = { runPythonScript };

// runPythonScript('./condense_font.py', [
//   './fonts/FiraCode-Regular.ttf',
//   './fonts',
// ]);
