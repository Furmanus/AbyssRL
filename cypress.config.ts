import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5020',
    specPattern: 'cypress/e2e/**/*.e2e-spec.ts',
  },
});
