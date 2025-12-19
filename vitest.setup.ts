import { config } from '@vue/test-utils'

// Example: Mock the i18n plugin
config.global.mocks = {
  $t: (key: string) => key
}
