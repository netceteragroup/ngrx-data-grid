// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
if (process.env.NODE_ENV === 'CI') {
  process.env.CHROME_BIN = require('puppeteer').executablePath();
}
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../../coverage/grid'),
      reports: ['html', 'lcovonly'],
      fixWebpackSourcePaths: true
    },
    junitReporter: {
      outputDir: 'target/coverage/surefire-reports',
      outputFile: 'karma-report.xml',
      useBrowserName: false,
      suite: 'tests'
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['Chrome', 'PcsChromeHeadless'],
    customLaunchers: {
      PcsChromeHeadless: {
        base: 'ChromeHeadless',
        flags: [
          '--disable-gpu',
          '--no-sandbox'
        ]
      }
    },
    autoWatch: true,
    singleRun: false,
    browserDisconnectTolerance: 2,
    browserNoActivityTimeout: 50000,
    restartOnFileChange: true
  });
};
