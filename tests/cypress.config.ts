import { defineConfig } from 'cypress';
import mochawesomeReporter from 'cypress-mochawesome-reporter/plugin';
import { reporterConfig } from './reporter-config';
let token;
let tempData;

export default defineConfig({
  retries: 0,
  reporter: 'cypress-multi-reporters',
  reporterOptions: reporterConfig,
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:3000/',
    defaultCommandTimeout: 30000,
    responseTimeout: 30000,
    requestTimeout: 30000,
    chromeWebSecurity: false,
    viewportWidth: 1920,
    viewportHeight: 1080,
    watchForFileChanges: false,
    experimentalRunAllSpecs: true,
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    screenshotOnRunFailure: true,
    testIsolation: false,
    specPattern: '**/tests/**/*.spec.ts',
    fixturesFolder: 'cypress/testdata',
    env: {
      authUrl: 'https://saucedemo.com/connect/token',
      apiBaseUrl: process.env.API_BASE_URL || 'https://restcountries.com/v3.1',
      swaggerSchemaUrl: `${process.env.CYPRESS_BASE_URL}/swagger/v1/swagger.json`,
    },
    setupNodeEvents(on, config) {
      mochawesomeReporter(on);
      require('@cypress/grep/src/plugin')(config);
      on('task', {
        setToken: newToken => {
          token = newToken;
          return null;
        },
        getToken: () => {
          return token;
        },
        setTempData: newTempData => {
          tempData = newTempData;
          return null;
        },
        getTempData: () => {
          return tempData;
        },
      });
      return config;
    },
  },
});
