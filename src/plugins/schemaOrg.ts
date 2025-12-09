import type { App } from 'vue';
import { useSchemaOrg } from '@/composables/useSchemaOrg';

export default {
  install: (app: App) => {
    // Make $schema available in template
    app.config.globalProperties.$schema = useSchemaOrg();
    
    // Also provide it via provide/inject
    app.provide('schema', useSchemaOrg());
  }
};
