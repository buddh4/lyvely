#!/usr/bin/env node

const { execSync } = require('child_process');

const runCommand = (command) => {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Failed to execute ${command}`, error);
    process.exit(1);
  }
};

const buildModuleWeb = (options) => {
  // Assuming the process is run from the package directory that needs to be built

  options = options || {};
  const viteCommand = `vite build` + (options.mode ? ` --mode ${options.mode}` : '');
  const vueTscCommand = 'vue-tsc -p tsconfig.build.json --declaration --emitDeclarationOnly';
  const tailwindCommand = 'npx postcss ./src/styles/tailwind.css -o ./dist/tailwind.css';

  runCommand(viteCommand);
  runCommand(vueTscCommand);
  runCommand(tailwindCommand);
};

const args = process.argv.slice(2);
if (args.length > 0 && args[0] === 'build:web') {
  buildModuleWeb();
}

if (args.length > 0 && args[0] === 'build:web:staging') {
  buildModuleWeb({ mode: 'staging' });
}

if (args.length > 0 && args[0] === 'build:web:development') {
  buildModuleWeb({ mode: 'development' });
}
