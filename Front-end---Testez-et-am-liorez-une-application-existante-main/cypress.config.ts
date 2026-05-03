import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on: any, config: any) {
      // Intégration de la couverture de code pour les tests E2E
      require('@cypress/code-coverage/task')(on, config);

      return config;
    },
  },
});