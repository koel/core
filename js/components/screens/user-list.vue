<template>
  <section id="usersWrapper">
    <h1 class="heading">
      <span>Users
        <i class="fa fa-angle-down toggler" v-show="isPhone && !showingControls" @click="showingControls = true"></i>
        <i class="fa fa-angle-up toggler" v-show="isPhone && showingControls" @click.prevent="showingControls = false"></i>
      </span>

      <div class="buttons" v-show="!isPhone || showingControls">
        <button class="btn btn-green btn-add" @click="showAddUserForm">
          <i class="fa fa-plus"></i>
          Add</button>
      </div>
    </h1>

    <div class="main-scroll-wrap">
      <div class="users">
        <user-card v-for="user in state.users" :user="user" @editUser="showEditUserForm" :key="user.id"/>
      </div>
    </div>
  </section>
</template>

<script>
import isMobile from 'ismobilejs'

import { userStore } from '@/stores'
import { event } from '@/utils'

export default {
  components: {
    UserCard: () => import('@/components/user/card.vue')
  },

  data () {
    return {
      state: userStore.state,
      isPhone: isMobile.phone,
      showingControls: false
    }
  },

  methods: {
    showAddUserForm: () => event.emit(event.$names.MODAL_SHOW_ADD_USER_FORM),
    showEditUserForm: user => event.emit(event.$names.MODAL_SHOW_EDIT_USER_FORM, user)
  }
}
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
    }

    h1 {
      font-size: 1.4rem;
      margin-bottom: 5px;

      .you {
        color: $colorHighlight;
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
