const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://stg.platform.creatingly.com/",
    chromeWebSecurity: false,
    experimentalModifyObstructiveThirdPartyCode: true,

    // <-- Add these two lines
    supportFile: "cypress/support/commands.js", // path to your support file from root
    specPattern: "cypress/e2e/**/*.js",        // adjust if your tests are inside 1getting-started/

    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});