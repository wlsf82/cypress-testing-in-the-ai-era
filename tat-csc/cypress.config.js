const { defineConfig } = require("cypress");

module.exports = defineConfig({
  allowCypressEnv: false,

  e2e: {
    baseUrl: "https://tat-csc.s3.sa-east-1.amazonaws.com",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
