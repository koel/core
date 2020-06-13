<template>
  <article class="user-item" :class="{ me: isCurrentUser }">
    <div class="info">
      <img :src="user.avatar" width="128" height="128">

      <div class="right">
        <div>
          <h1>
            {{ user.name }}
            <i v-if="isCurrentUser" class="you fa fa-check-circle" title="This is you!"></i>
            <i v-if="user.is_admin" class="is-admin fa fa-shield" title="User has admin privileges"></i>
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

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { userStore } from '@/stores'
import router from '@/router'
import { alerts } from '@/utils'

export default Vue.extend({
  components: {
    Btn: () => import('@/components/ui/btn.vue')
  },

  props: {
    user: {
      type: Object,
      required: true
    } as PropOptions<User>
  },

  data: () => ({
    confirmingDelete: false
  }),

  computed: {
    isCurrentUser (): boolean {
      return this.user.id === userStore.current.id
    }
  },

  methods: {
    /**
     * Trigger editing a user.
     * If the user is the current logged-in user, redirect to the profile screen instead.
     */
    edit (): void {
      this.isCurrentUser ? router.go('profile') : this.$emit('editUser', this.user)
    },

    confirmDelete (): void {
      alerts.confirm(`You’re about to unperson ${this.user.name}. Are you sure?`, this.destroy)
    },

    destroy (): void {
      userStore.destroy(this.user)
      this.$destroy()
    }
  }
})
</script>

<style lang="scss" scoped>
@import "~#/partials/_vars.scss";

.user-item {
  width: 100%;

  .info {
    display: flex;

    img {
      flex: 0 0 128px;
    }

    .right {
      flex: 1;
      padding: 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background-color: rgba(255, 255, 255, .02);
      position: relative;
    }

    h1 {
      font-size: 1.4rem;
      margin-bottom: 8px;

      .you {
        color: $colorHighlight;
        margin-left: 5px;
      }

      .is-admin {
        color: $colorBlue;
        margin-left: 5px;
      }
    }

    .buttons {
      display: none;
      margin-top: 16px;
    }

    &:hover, html.touchevents & {
      .buttons {
        display: block;
      }
    }
  }

  @media only screen and (max-width: 1024px) {
    width: 100%;
  }
}
</style>
