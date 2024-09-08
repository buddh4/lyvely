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

/**
 * @param cssContent
 * @returns {*}
 */
const unescapeCssSelectors = (cssContent) => {
  return (
    removeSpecialBlocks(cssContent)
      // Remove comments
      .replace(/\s*\/\*[^\*]+\*\/\s*/g, ' ')
      // Remove all definitions
      .replace(/\{[^}]*\}/g, ' ')
      // Remove pseudo classes (which are unescaped)
      .replace(/(?<!\\):[^ ]+/g, ' ')
      // Remove escapes
      .replace(/\\/g, '')
  );
};

function removeSpecialBlocks(cssText) {
  // Regular expression to match and replace any @rule block, keeping only the inner content
  const regex = /@\w+\s*[^{]*\{([\s\S]*?)\}/g;

  // Replace all matches of the outer block with only their inner content
  return cssText.replace(regex, (_, innerContent) => innerContent.trim());
}


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
  // const vueTscCommand = 'vue-tsc -p tsconfig.build.json --declaration --emitDeclarationOnly';
  const tailwindCommand = 'npx postcss ./src/styles/tailwind.css -o ./dist/tailwind.css';

  runCommand('vue-tsc --project tsconfig.build.json --noEmit');
  runCommand(viteCommand);
  // runCommand(vueTscCommand);
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
