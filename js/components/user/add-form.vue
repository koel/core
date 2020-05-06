<template>
  <div class="add-user">
    <sound-bar v-if="loading"/>
    <form class="user-add" @submit.prevent="submit" v-else>
      <header>
        <h1>Add New User</h1>
      </header>

      <div>
        <div class="form-row">
          <label>Name</label>
          <input title="Name" type="text" name="name" v-model="newUser.name" required v-koel-focus>
        </div>
        <div class="form-row">
          <label>Email</label>
          <input title="Email" type="email" name="email" v-model="newUser.email" required>
        </div>
        <div class="form-row">
          <label>Password</label>
          <input title="Password" type="password" name="password" v-model="newUser.password">
        </div>
      </div>

      <footer>
        <btn class="btn-add">Save</btn>
        <btn class="btn-cancel" @click.prevent="close" white>Cancel</btn>
      </footer>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { clone } from 'lodash'
import { userStore } from '@/stores'

export default Vue.extend({
  components: {
    Btn: () => import('@/components/ui/btn.vue'),
    SoundBar: () => import('@/components/ui/sound-bar.vue')
  },

  data: () => ({
    loading: false,
    newUser: clone(userStore.stub)
  }),

  methods: {
    async submit () {
      this.loading = true
      await userStore.store(this.newUser.name, this.newUser.email, this.newUser.password)
      this.loading = false
      this.close()
    },

    close (): void {
      this.$emit('close')
    }
  }
})
</script>
