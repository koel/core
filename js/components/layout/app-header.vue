<template>
  <header id="mainHeader" @dblclick="triggerMaximize" data-cy="appHeader">
    <h1 class="brand" v-once>{{ appName }}</h1>
    <span class="hamburger" @click="toggleSidebar" role="button" title="Show or hide the sidebar">
      <i class="fa fa-bars"></i>
    </span>
    <span class="magnifier" @click="toggleSearchForm" role="button" title="Show or hide the search form">
      <i class="fa fa-search"></i>
    </span>
    <search-form/>
    <div class="header-right">
      <user-badge/>
      <a
        @click.prevent="showAboutDialog"
        class="about control"
        href
        title="About Koel"
        role="button"
      >
        <i class="fa fa-info-circle"/>
      </a>
    </div>
  </header>

</template>

<script lang="ts">
import Vue from 'vue'
import { eventBus, app } from '@/utils'
import { app as appConfig, events } from '@/config'

export default Vue.extend({
  components: {
    SearchForm: () => import('@/components/ui/search-form.vue'),
    UserBadge: () => import('@/components/user/badge.vue')
  },

  data: () => ({
    appName: appConfig.name
  }),

  methods: {
    toggleSidebar: (): void => {
      eventBus.emit(events.TOGGLE_SIDEBAR)
    },

    toggleSearchForm: (): void => {
      eventBus.emit(events.TOGGLE_SEARCH_FORM)
    },

    triggerMaximize: (): void => {
      app.triggerMaximize()
    },

    showAboutDialog: (): void => {
      eventBus.emit(events.MODAL_SHOW_ABOUT_DIALOG)
    }
  }
})
</script>

<style lang="scss">
@import "~#/partials/_vars.scss";
@import "~#/partials/_mixins.scss";

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

  .header-right {
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: flex-end;

    .about {
      height: 100%;
      @include vertical-center();
      padding: 16px;
      border-left: 1px solid rgba(255, 255, 255, .1);
    }
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
