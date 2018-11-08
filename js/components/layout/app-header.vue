<template>
  <header id="mainHeader" @dblclick="triggerMaximize">
    <h1 class="brand" v-once>{{ appName }}</h1>
    <span class="hamburger" @click="toggleSidebar">
      <i class="fa fa-bars"></i>
    </span>
    <span class="magnifier" @click="toggleSearchForm">
      <i class="fa fa-search"></i>
    </span>
    <search-form/>
    <user-badge/>
  </header>

</template>

<script>
import { app as appConfig } from '@/config'
import { event, app } from '@/utils'

export default {
  components: {
    SearchForm: () => import('@/components/ui/search-form.vue'),
    UserBadge: () => import('@/components/user/badge.vue')
  },

  data: () => ({
    appName: appConfig.name
  }),

  methods: {
    toggleSidebar: () => event.emit(event.$names.TOGGLE_SIDEBAR),
    toggleSearchForm: () => event.emit(event.$names.TOGGLE_SEARCH_FORM),
    triggerMaximize: () => app.triggerMaximize()
  }
}
</script>

<style lang="scss">
@import "~#/partials/_vars.scss";

#mainHeader {
  height: $headerHeight;
  background: $color2ndBgr;
  display: flex;
  border-bottom: 1px solid $colorMainBgr;
  -webkit-app-region: drag;

  input, a {
    -webkit-app-region: no-drag;
  }

  h1.brand {
    flex: 1;
    color: $colorMainText;
    font-size: 1.7rem;
    font-weight: $fontWeight_UltraThin;
    opacity: 0;
    line-height: $headerHeight;
    text-align: center;
  }

  .hamburger, .magnifier {
    font-size: 1.4rem;
    flex: 0 0 48px;
    order: -1;
    line-height: $headerHeight;
    text-align: center;
    display: none;
  }

  @media only screen and (max-width: 667px) {
    display: flex;
    align-content: stretch;
    justify-content: flext-start;

    .hamburger, .magnifier {
      display: inline-block;
    }

    h1.brand {
      opacity: 1;
    }
  }
}
</style>
