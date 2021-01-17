<template>
  <form @submit.prevent="update" data-testid="update-profile-form">
    <div class="form-row">
      <label for="inputProfileName">Name</label>
      <input type="text" name="name" id="inputProfileName" v-model="state.current.name">
    </div>

    <div class="form-row">
      <label for="inputProfileEmail">Email Address</label>
      <input type="email" name="email" id="inputProfileEmail" v-model="state.current.email">
    </div>

    <div class="change-password">
      <div class="form-row">
        <p class="help">
          If you want to change your password, enter it below.<br>
          Otherwise, just leave the next two fields empty.
        </p>
      </div>

      <div class="form-row">
        <label for="inputProfilePassword">New Password</label>
        <input
          :class="{ error: validation.error }"
          v-model="password"
          name="password"
          type="password"
          id="inputProfilePassword"
          autocomplete="new-password"
        >
      </div>

      <div class="form-row">
        <label for="inputProfileConfirmPassword">Confirm Password</label>
        <input
          :class="{ error: validation.error }"
          v-model="confirmPassword"
          name="confirm_password"
          type="password"
          id="inputProfileConfirmPassword"
          autocomplete="new-password"
        >
      </div>
    </div>

    <div class="form-row">
      <btn type="submit" class="btn-submit">Save</btn>
      <span v-if="demo" style="font-size:.95rem; opacity:.7; margin-left:5px">
            Changes will not be saved in the demo version.
          </span>
    </div>
  </form>
</template>

<script lang="ts">
import Vue from 'vue'
import { preferenceStore as preferences, sharedStore, userStore } from '@/stores'

export default Vue.extend({
  components: {
    Btn: () => import('@/components/ui/btn.vue')
  },

  data: () => ({
    preferences,
    demo: NODE_ENV === 'demo',
    state: userStore.state,
    cache: userStore.stub,
    password: '',
    confirmPassword: '',
    sharedState: sharedStore.state,
    validation: {
      error: false
    }
  }),

  methods: {
    async update (): Promise<void> {
      this.validation.error = Boolean((this.password || this.confirmPassword) && this.password !== this.confirmPassword)

      if (this.validation.error) {
        return
      }

      await userStore.updateProfile(this.password)
      this.password = ''
      this.confirmPassword = ''
    }
  }
})
</script>

<style lang="scss" scoped>
input {
  &[type="text"], &[type="email"], &[type="password"] {
    width: 33%;
  }

  &.error {
    // Chrome won't give up its autofill style, so this is kind of a hack.
    box-shadow: 0 0 0 1000px #ff867a inset;
  }
}

.change-password {
  padding: 1.75rem 0;
}

@media only screen and (max-width : 667px) {
  input {
    &[type="text"], &[type="email"], &[type="password"] {
      width: 100%;
      height: 32px;
    }
  }
}
</style>
