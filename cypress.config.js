const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://stg.platform.creatingly.com/",
    chromeWebSecurity: false,
    experimentalModifyObstructiveThirdPartyCode: true,

    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
