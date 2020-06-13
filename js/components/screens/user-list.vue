<template>
  <section id="usersWrapper">
    <h1 class="heading">
      <span>Users
        <i class="fa fa-angle-down toggler" v-show="isPhone && !showingControls" @click="showingControls = true"></i>
        <i class="fa fa-angle-up toggler" v-show="isPhone && showingControls" @click.prevent="showingControls = false"></i>
      </span>

      <btn-group v-show="!isPhone || showingControls" uppercased>
        <btn class="btn-add" @click="showAddUserForm" green>
          <i class="fa fa-plus"></i>
          Add
        </btn>
      </btn-group>
    </h1>

    <div class="main-scroll-wrap">
      <div class="users">
        <user-card v-for="user in state.users" :user="user" @editUser="showEditUserForm" :key="user.id"/>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import isMobile from 'ismobilejs'

import { userStore } from '@/stores'
import { eventBus } from '@/utils'
import { events } from '@/config'

export default Vue.extend({
  components: {
    Btn: () => import('@/components/ui/btn.vue'),
    BtnGroup: () => import('@/components/ui/btn-group.vue'),
    UserCard: () => import('@/components/user/card.vue')
  },

  data: () => ({
    state: userStore.state,
    isPhone: isMobile.phone,
    showingControls: false
  }),

  methods: {
    showAddUserForm: (): void => {
      eventBus.emit(events.MODAL_SHOW_ADD_USER_FORM)
    },

    showEditUserForm: (user: User): void => {
      eventBus.emit(events.MODAL_SHOW_EDIT_USER_FORM, user)
    }
  }
})
</script>

<style lang="scss">
@import "~#/partials/_vars.scss";

#usersWrapper {
  .users {
    display: grid;
    grid-gap: 16px;
    grid-template-columns: repeat(auto-fit, minmax(320px,1fr));
  }

  button {
    margin-right: 3px;
  }

  @media only screen and (max-width: 768px) {
    .users {
      .buttons {
        margin-top: 12px;
        display: block;
      }
    }
  }
}
</style>
