const fs = require('fs');
const path = require('path');
const globby = require('globby');
const ejs = require('ejs');

const fileContent = (filePath: string): string =>
  fs.readFileSync(filePath, 'utf-8');

const packageJson = JSON.parse(fileContent('package.json'));

const ENCODING = 'utf-8';

const EXAMPLE_FILES = [
  '!**',
  'projects/data-grid-demo/**/*.*',
  '!**/*.spec.ts',
  '!**/*.js',
  '!**/README.md'
];

const dataGridVersion = packageJson.version;
const stackblitzUrl = 'https://stackblitz.com/run?file=projects/data-grid-demo/src/app/app.component.ts';
const tags = ['angular', 'ngrx-data-grid', 'redux', 'example', 'data-grid'];

const templatesPath = (fileName: string): string =>
  path.join('scripts', 'stackblitz-templates', fileName);

const destinationPath = (fileName: string): string =>
  path.join('dist', 'data-grid-demo', fileName);

const getVersion = (name: string) =>
  packageJson.dependencies[name] || packageJson.devDependencies[name];

const versions = {
  ngrxDataGrid: dataGridVersion,
  angular: getVersion('@angular/core'),
  typescript: getVersion('typescript'),
  rxjs: getVersion('rxjs'),
  zoneJs: getVersion('zone.js'),
  coreJs: getVersion('core-js'),
  bootstrap: getVersion('bootstrap'),
  ngBootstrap: getVersion('@ng-bootstrap/ng-bootstrap'),
  ngrx: getVersion('@ngrx/store'),
  ramda: getVersion('ramda'),
  tslib: getVersion('tslib'),
  materialDesignIcons: getVersion('material-design-icons')
};

const dependencies = JSON.stringify({
  'ngrx-data-grid': versions.ngrxDataGrid,
  '@angular/core': versions.angular,
  '@angular/common': versions.angular,
  '@angular/compiler': versions.angular,
  '@angular/platform-browser': versions.angular,
  '@angular/platform-browser-dynamic': versions.angular,
  '@ng-bootstrap/ng-bootstrap': versions.ngBootstrap,
  '@ngrx/store': versions.ngrx,
  '@ngrx/store-devtools': versions.ngrx,
  'core-js': versions.coreJs,
  'rxjs': versions.rxjs,
  'zone.js': versions.zoneJs,
  'ramda': versions.ramda,
  'bootstrap': versions.bootstrap,
  'tslib': versions.tslib,
  'material-design-icons': versions.materialDesignIcons
});

const getExampleFiles = async () => {
  const paths = await globby(EXAMPLE_FILES, {ignore: ['**/node_modules/**']});

  const files = paths.map((filePath) => {
    const contents = fileContent(filePath);

    return {path: filePath, contents};
  }, {});

  const angularJsonContent = fileContent(templatesPath('stackblitz-angular.json'));

  return [...files, {path: 'angular.json', contents: angularJsonContent}]
};

const build = async () => {
  const files = await getExampleFiles();

  const stackblitzFile = ejs.compile(fileContent(templatesPath('stackblitz.html.ejs')));
  const stackblitzData = {
    stackblitzUrl,
    dependencies,
    tags,
    files
  };

  fs.writeFileSync(destinationPath('stackblitz.html'), stackblitzFile(stackblitzData), ENCODING);
};

build();
