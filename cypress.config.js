const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // if you want to disable support file
    supportFile: false,
    // or use default:
    // supportFile: "cypress/support/e2e.js"
  }
});