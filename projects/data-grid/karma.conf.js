// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-coverage'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageReporter: {
      dir: require('path').join(__dirname, '../../coverage'),
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'lcov', subdir: '.' },
        { type: 'text-summary'}
      ],
      fixWebpackSourcePaths: true,
      check: {
        global: {
          statements: 90,
          branches: 70,
          functions: 85,
          lines: 90,
          excludes: [
          ]
        }
      }
    },
    junitReporter: {
      outputDir: 'target/coverage/surefire-reports',
      outputFile: 'karma-report.xml',
      useBrowserName: false,
      suite: 'tests'
    },
    reporters: ['progress', 'coverage', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['ChromeHeadless'],
    autoWatch: true,
    singleRun: false,
    restartOnFileChange: true
  });
};
