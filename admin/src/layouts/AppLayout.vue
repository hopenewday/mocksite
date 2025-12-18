<script setup lang="ts">
import {
  VaNavbar,
  VaSidebar,
  VaSidebarItem,
  VaSidebarItemContent,
  VaSidebarItemTitle,
  VaIcon,
  VaButton,
} from 'vuestic-ui'
import { useAuth } from '../composables/useAuth'
import { useRouter } from 'vue-router'

const { user, logout } = useAuth()
const router = useRouter()

const sidebarItems = [
  { name: 'Question Bank', icon: 'va-interrogation', to: { name: 'question-bank' } },
  { name: 'Test Management', icon: 'va-file-text', to: { name: 'test-management' } },
  { name: 'User Management', icon: 'va-user', to: { name: 'user-management' } },
  { name: 'Category Management', icon: 'va-folder', to: { name: 'category-management' } },
  { name: 'Results & Analytics', icon: 'va-chart-bar', to: { name: 'results-analytics' } },
  { name: 'Audit Logs', icon: 'va-shield', to: { name: 'audit-logs' } },
]

const handleLogout = async () => {
  await logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="app-layout">
    <VaSidebar>
      <VaSidebarItem v-for="item in sidebarItems" :key="item.name" :to="item.to" :active="router.currentRoute.value.name === item.to.name">
        <VaSidebarItemContent>
          <VaIcon :name="item.icon" />
          <VaSidebarItemTitle>{{ item.name }}</VaSidebarItemTitle>
        </VaSidebarItemContent>
      </VaSidebarItem>
    </VaSidebar>
    <main class="app-layout__content">
      <VaNavbar color="primary" class="app-layout__navbar">
        <template #right>
          <div class="flex items-center">
            <span class="mr-4">{{ user?.email }}</span>
            <VaButton @click="handleLogout">Logout</VaButton>
          </div>
        </template>
      </VaNavbar>
      <div class="p-4">
        <router-view />
      </div>
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
}
.app-layout__content {
  flex-grow: 1;
  overflow-y: auto;
}
.app-layout__navbar {
  width: 100%;
}
</style>
