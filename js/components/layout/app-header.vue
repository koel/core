<template>
  <header id="mainHeader" @dblclick="triggerMaximize">
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
      <button @click.prevent="showAboutDialog" class="about control" title="About Koel" data-testid="about-btn">
        <i class="fa fa-info-circle"></i>
      </button>
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
@import "~#/partials/_mixins.scss";

#mainHeader {
  height: var(--header-height);
  background: var(--color-background-secondary);
  display: flex;
  border-bottom: 1px solid var(--color-background-main);
  -webkit-app-region: drag;

  input, a {
    -webkit-app-region: no-drag;
  }

  h1.brand {
    flex: 1;
    color: var(--color-white);
    font-size: 1.7rem;
    font-weight: var(--font-weight-thin);
    opacity: 0;
    line-height: var(--header-height);
    text-align: center;
  }

  .hamburger, .magnifier {
    font-size: 1.4rem;
    flex: 0 0 48px;
    order: -1;
    line-height: var(--header-height);
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
