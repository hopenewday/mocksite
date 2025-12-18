
<template>
  <VaForm ref="form" @submit.prevent="submit">
    <h1 class="font-semibold text-4xl mb-4">Log in</h1>
    <VaInput
      v-model="formData.email"
      :rules="[(v) => !!v || 'Email is required']"
      class="mb-4"
      label="Email"
      type="email"
    />
    <VaInput
      v-model="formData.password"
      :rules="[(v) => !!v || 'Password is required']"
      class="mb-4"
      label="Password"
      type="password"
    />
    <div class="flex justify-center mt-4">
      <VaButton class="w-full" @click="submit"> Login</VaButton>
    </div>
  </VaForm>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useToast } from 'vuestic-ui'
import { supabase } from '../supabase/client'

const { validate } = useForm('form')
const { push } = useRouter()
const { init } = useToast()

const formData = reactive({
  email: '',
  password: '',
})

const submit = async () => {
  if (validate()) {
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    })

    if (error) {
      init({ message: error.message, color: 'danger' })
    } else {
      init({ message: "You've successfully logged in", color: 'success' })
      // Redirect to dashboard or another protected page
    }
  }
}
</script>
