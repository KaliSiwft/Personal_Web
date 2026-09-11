const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 15000,
  use: {
    baseURL: 'http://127.0.0.1:8181',
  },
  webServer: {
    command: 'npx http-server . -p 8181 --silent',
    port: 8181,
    reuseExistingServer: true,
  },
});
