#!/usr/bin/env node
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import fs from 'fs';
import path from 'path';

const inputFile = path.join(process.cwd(), 'src/input.css');
const outputFile = path.join(process.cwd(), 'public/style.css');

const input = fs.readFileSync(inputFile, 'utf-8');

postcss([tailwindcss, autoprefixer])
  .process(input, {
    from: inputFile,
    to: outputFile,
    map: false,
  })
  .then((result) => {
    fs.writeFileSync(outputFile, result.css);
    console.log('✓ CSS built successfully');
  })
  .catch((err) => {
    console.error('Error building CSS:', err);
    process.exit(1);
  });
