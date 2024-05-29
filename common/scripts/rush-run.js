// run-script.js
const { execSync }  = require('child_process');

// Get arguments passed to the script
const args = process.argv.slice(2);
const workspaceName = args[1];
const scriptName = args[3];

if (!workspaceName || !scriptName) {
  console.error('Usage: "node rush-run -t <workspace> -s <script>"');
  process.exit(1);
}

if (!/^[a-z0-9-_:]+$/i.test(scriptName)) {
  console.error('Invalid script name. Please use a valid package.json script.');
  process.exit(1);
}

try {
  const rushListRaw = execSync('rush list --full-path --json', { stdio: 'pipe' });
  const rushList = JSON.parse(rushListRaw);
  const project = rushList.projects.find(p => p.name === workspaceName);

  if (!project) {
    console.error(`Workspace "${workspaceName}" not found.`);
    process.exit(1);
  }

  console.log(`Running script "${scriptName}" for workspace "${workspaceName}" at "${project.fullPath}"`);

  // Execute the script in directory of the project
  execSync(`cd ${project.fullPath} && pnpm run ${scriptName}`, { stdio: [0, 1, 2] });
} catch (error) {
  console.error('Error running script:', error);
}
