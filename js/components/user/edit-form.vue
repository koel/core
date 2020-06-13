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
          <input
            name="password"
            placeholder="Leave blank for no changes"
            type="password"
            v-model="mutatedUser.password"
          >
        </div>
        <div class="form-row">
          <label>
            <input type="checkbox" name="is_admin" v-model="mutatedUser.is_admin"> User is an admin
            <i
              class="fa fa-question-circle help-trigger"
              title="Admins can perform administrative tasks like manage users and upload songs.">
            </i>
          </label>
        </div>
      </div>

      <footer>
        <btn class="btn-update" type="submit">Update</btn>
        <btn class="btn-cancel" @click.prevent="close" white>Cancel</btn>
      </footer>
    </form>
  </div>
</template>

<script lang="ts">
import { userStore } from '@/stores'
import Vue, { PropOptions } from 'vue'

export default Vue.extend({
  components: {
    Btn: () => import('@/components/ui/btn.vue'),
    SoundBar: () => import('@/components/ui/sound-bar.vue')
  },

  props: {
    user: {
      type: Object,
      required: true
    } as PropOptions<User>
  },

  data: () => ({
    loading: false,
    mutatedUser: null as unknown as User
  }),

  methods: {
    async submit (): Promise<void> {
      this.loading = true

      await userStore.update(
        this.user,
        this.mutatedUser.name,
        this.mutatedUser.email,
        this.mutatedUser.password,
        this.mutatedUser.is_admin
      )

      this.loading = false
      this.close()
    },

    close (): void {
      this.$emit('close')
    }
  },

  created (): void {
    this.mutatedUser = Object.assign({}, this.user)
  }
})
</script>
