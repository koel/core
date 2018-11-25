<template>
  <div class="edit-user">
    <sound-bar v-if="loading"/>
    <form class="user-edit" @submit.prevent="submit" v-else>
      <header>
        <h1>Edit User</h1>
      </header>

      <div>
        <div class="form-row">
          <label>Name</label>
          <input title="Name" type="text" name="name" v-model="mutatedUser.name" required v-koel-focus>
        </div>
        <div class="form-row">
          <label>Email</label>
          <input title="Email" type="email" name="email" v-model="mutatedUser.email" required>
        </div>
        <div class="form-row">
          <label>Password</label>
          <input type="password" name="password" v-model="mutatedUser.password" placeholder="Leave blank for no changes">
        </div>
      </div>

      <footer>
        <button class="btn btn-green btn-update" type="submit">Update</button>
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

  props: {
    user: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      loading: false,
      mutatedUser: null
    }
  },

  methods: {
    async submit () {
      this.loading = true
      await userStore.update(this.user, this.mutatedUser.name, this.mutatedUser.email, this.mutatedUser.password)
      this.loading = false
      this.close()
    },

    close () {
      this.$emit('close')
    }
  },

  created () {
    this.mutatedUser = clone(this.user)
  }
}
</script>
