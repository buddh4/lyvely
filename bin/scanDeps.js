const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const packagesDir = './packages'; // Change this to the path of your packages folder
const outputFile = 'output.txt';

function executeShellCommand(folderPath, name) {
  const command = `find ${folderPath} -type f -name "*.ts" -exec grep -Eho '${name}/[^[:space:]]*' {} + | sort | uniq`;

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}

async function processPackages() {
  try {
    const packageFolders = await fs.promises.readdir(packagesDir);

    for (const folder of packageFolders) {
      const folderPath = path.join(packagesDir, folder);
      const output1 = await executeShellCommand(folderPath, '@nestjs');
      const output2 = await executeShellCommand(folderPath, '@lyvely');

      if (output1.trim() || output2.trim()) {
        // Write the output to the file with a folder headline
        const headline = `=== ${folder} [] ===\n`;
        fs.appendFileSync(outputFile, headline);
        fs.appendFileSync(outputFile, output1);
        fs.appendFileSync(outputFile, output2);
        fs.appendFileSync(outputFile, '\n\n');
      }
    }

    console.log(`Output has been written to ${outputFile}`);
  } catch (error) {
    console.error('Error:', error);
  }
}

processPackages();
