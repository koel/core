<template>
  <section id="profileWrapper">
    <screen-header>Profile &amp; Preferences</screen-header>

    <div class="main-scroll-wrap">
      <profile-form/>
      <themes v-if="!isMobile"/>
      <preferences/>
      <lastfm-integration/>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import isMobile from 'ismobilejs'

export default Vue.extend({
  components: {
    ScreenHeader: () => import('@/components/ui/screen-header.vue'),
    ProfileForm: () => import('@/components/profile-preferences/profile-form.vue'),
    LastfmIntegration: () => import('@/components/profile-preferences/lastfm-integration.vue'),
    Preferences: () => import('@/components/profile-preferences/preferences.vue'),
    Themes: () => import('@/components/profile-preferences/themes.vue')
  },

  data: () => ({
    isMobile: isMobile.any
  })
})
</script>

<style lang="scss">
#profileWrapper {
  .main-scroll-wrap > * + * {
    margin-top: 1.75rem;
    padding-top: 1.75rem;
    border-top: 1px solid var(--color-background-secondary);
  }

  .main-scroll-wrap h1 {
    font-size: 1.85rem;
    margin-bottom: 1.25rem;
  }
}
</style>
