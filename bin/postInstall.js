#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const moduleToDelete = '@types/react';

const modulePath = path.join(process.cwd(), 'node_modules', moduleToDelete);

try {
  fs.rmSync(modulePath, { recursive: true });
  console.log(`Deleted ${moduleToDelete} module from node_modules.`);
} catch (err) {
  console.error(`Failed to delete ${moduleToDelete} module:`, err);
}
