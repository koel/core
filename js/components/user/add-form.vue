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
        <button class="btn btn-green btn-add">Save</button>
        <button class="btn btn-white btn-cancel" @click.prevent="close">Cancel</button>
      </footer>
    </form>
  </div>
</template>

<script>
import { clone } from 'lodash'
import { userStore } from '@/stores'

export default {
  components: {
    SoundBar: () => import('@/components/ui/sound-bar.vue')
  },

  data () {
    return {
      loading: false,
      newUser: null
    }
  },

  methods: {
    async submit () {
      this.loading = true
      await userStore.store(this.newUser.name, this.newUser.email, this.newUser.password)
      this.loading = false
      this.close()
    },

    close () {
      this.$emit('close')
    }
  },

  created () {
    this.newUser = clone(userStore.stub)
  }
}
</script>
