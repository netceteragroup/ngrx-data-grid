const { copyFileSync } = require('fs');
const { join } = require('path');

const FILES = [
  'LICENSE',
  'README.md'
];

const dest = (fileName: string) => join('dist', 'ngrx-data-grid', fileName);

const logCopyOperation = (from: string, to: string) =>
  console.log(`Copying ${from} to ${to}...`);

const copyFilesToDist = () => {
  FILES.forEach(file => {
    const to = dest(file);
    logCopyOperation(file, to);
    copyFileSync(file, to);
  });
};

const run = () => {
  try {
    console.log('Copying dist files!');
    copyFilesToDist();
    console.log('All files copied successfully!');
  } catch (e) {
    console.error('Error while copying files to dist:', e);
  }
};

run();
