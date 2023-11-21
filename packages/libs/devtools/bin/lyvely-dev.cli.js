#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const CleanCSS = require('clean-css');

const runCommand = (command) => {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Failed to execute ${command}`, error);
    process.exit(1);
  }
};

const unescapeCssSelectors = (cssContent) => {
  return cssContent.replace(/\\/g, '');
};

const unescapeCssFile = (inputFilePath, outputFilePath) => {
  fs.readFile(inputFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the CSS file:', err);
      return;
    }

    // Minify the CSS
    const minifiedContent = new CleanCSS({}).minify(data).styles;

    const unescapedContent = unescapeCssSelectors(minifiedContent);

    fs.writeFile(outputFilePath, unescapedContent, (err) => {
      if (err) {
        console.error('Error writing the unescaped CSS file:', err);
      } else {
        console.log('Successfully wrote the unescaped CSS to', outputFilePath);
      }
    });
  });
};

const buildModuleWeb = (options) => {
  options = options || {};
  const viteCommand = `vite build` + (options.mode ? ` --mode ${options.mode}` : '');
  const vueTscCommand = 'vue-tsc -p tsconfig.build.json --declaration --emitDeclarationOnly';
  const tailwindCommand = 'npx postcss ./src/styles/tailwind.css -o ./dist/tailwind.css';

  runCommand(viteCommand);
  runCommand(vueTscCommand);
  runCommand(tailwindCommand);

  // Add your CSS file paths here
  const inputCssPath = './dist/tailwind.css';
  const outputCssPath = './dist/tailwind.txt';

  // Process the CSS file to unescape selectors
  unescapeCssFile(inputCssPath, outputCssPath);
};

const args = process.argv.slice(2);

// Your existing conditions for build commands
if (args.length > 0 && args[0] === 'build:web') {
  buildModuleWeb();
} else if (args.length > 0 && args[0] === 'build:web:staging') {
  buildModuleWeb({ mode: 'staging' });
} else if (args.length > 0 && args[0] === 'build:web:development') {
  buildModuleWeb({ mode: 'development' });
}
