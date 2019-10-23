<template>
  <article class="user-item" :class="{ me: isCurrentUser }">
    <div class="info">
      <img :src="user.avatar" width="128" height="128">

      <div class="right">
        <div>
          <h1>{{ user.name }}
            <i v-if="isCurrentUser" class="you fa fa-check-circle"></i>
          </h1>
          <p>{{ user.email }}</p>
        </div>

        <div class="buttons">
          <btn class="btn-edit" @click="edit">
            {{ isCurrentUser ? 'Update Profile' : 'Edit' }}
          </btn>
          <btn v-if="!isCurrentUser" class="btn-delete" red @click="confirmDelete">Delete</btn>
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import { userStore } from '@/stores'
import router from '@/router'
import { alerts } from '@/utils'

export default {
  components: {
    Btn: () => import('@/components/ui/btn')
  },

  props: {
    user: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    confirmingDelete: false
  }),

  computed: {
    isCurrentUser () {
      return this.user.id === userStore.current.id
    }
  },

  methods: {
    /**
     * Trigger editing a user.
     * If the user is the current logged-in user, redirect to the profile screen instead.
     */
    edit () {
      this.isCurrentUser ? router.go('profile') : this.$emit('editUser', this.user)
    },

    confirmDelete () {
      alerts.confirm(`You’re about to unperson ${this.user.name}. Are you sure?`, this.destroy)
    },

    destroy () {
      userStore.destroy(this.user)
      this.$destroy()
    }
  }
}
</script>

