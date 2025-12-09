import { useSchemaOrg } from '@/composables/useSchemaOrg';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $schema: ReturnType<typeof useSchemaOrg>;
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $schema: ReturnType<typeof useSchemaOrg>;
  }
}
