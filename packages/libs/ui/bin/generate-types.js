#!/usr/bin/env node

import { parse } from 'vue-docgen-api';
import { sync } from 'glob';
import fs from 'fs/promises';
import packageJson from '../package.json' assert { type: 'json' };

const filesPattern = 'src/components/**/*.vue'; // Update the glob pattern according to your project structure

async function generateWebTypes() {
  try {
    const files = sync(filesPattern);

    const parsedData = [];
    for (const file of files) {
      try {
        const componentInfo = await parse(file, {
          plugins: [['typescript']],
        });
        parsedData.push(transformComponentInfo(componentInfo));
      } catch (e) {
        console.error('Error parsing file ' + file, e);
      }
    }

    const { name, version } = packageJson;

    const webTypesJson = JSON.stringify(
      {
        $schema: './web-types.schema.json',
        framework: 'vue',
        name,
        version,
        contributions: {
          html: {
            'types-syntax': 'typescript',
            tags: parsedData,
          },
        },
      },
      null,
      2,
    );
    await fs.writeFile('dist/web-types.json', webTypesJson);
    console.log('web-types.json generated successfully!');

    await fs.copyFile('schemas/web-types.schema.json', 'dist/web-types.schema.json');
    console.log('web-types.schema.json copied to dist directory.');
  } catch (error) {
    console.error('Error generating web-types.json:', error);
  }
}

function transformComponentInfo(componentInfo) {
  const { displayName, props } = componentInfo;
  const attributes = [];

  props?.forEach((prop) => {
    if (!prop?.type?.name) console.error(prop);
    attributes.push(constructAttr(prop.name, prop));
    const kebabCaseName = camelToKebab(prop.name);
    if (kebabCaseName !== prop.name) {
      attributes.push(constructAttr(kebabCaseName, prop));
    }
  });

  return {
    name: displayName,
    source: {
      symbol: displayName,
    },
    attributes,
  };
}

function constructAttr(name, prop) {
  const attr = {
    name,
    value: {
      kind: 'expression',
      type: prop.type.name,
    },
  };

  if (prop.defaultValue) {
    attr.default = prop.defaultValue.value;
  }

  return attr;
}

function camelToKebab(string) {
  return (
    string
      // Insert a hyphen between two consecutive characters where the first is lower and the second is upper case.
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      // Convert all letters to lower case.
      .toLowerCase()
  );
}

generateWebTypes();
