import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents() {
      // implement node event listeners here
    },
    experimentalWebKitSupport: true,
    chromeWebSecurity: false,
    video: false, // 禁用视频录制以提高性能
    viewportWidth: 1280,
    viewportHeight: 720,
  },
});
