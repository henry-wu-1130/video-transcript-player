import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents() {
      // implement node event listeners here
    },
    experimentalWebKitSupport: true,
    chromeWebSecurity: false,
    video: false,
    viewportWidth: 1280,
    viewportHeight: 720,
  },
});
