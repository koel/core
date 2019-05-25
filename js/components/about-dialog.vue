<template>
  <div class="about">
    <header>
      <h1>About Koel</h1>
    </header>

    <div role="content">
      <div class="logo">
        <img src="~#/../img/logo.svg" width="128" height="auto">
      </div>

      <p class="current-version">{{ sharedState.currentVersion }}</p>

      <p v-if="hasNewVersion" class="new-version">
        <a :href="latestVersionUrl" target="_blank">
            A new Koel version is available ({{ sharedState.latestVersion }}).
        </a>
      </p>

      <p class="author">
        Made with ❤️ by <a href="https://github.com/phanan" target="_blank">Phan An</a>
        and quite a few <a href="https://github.com/koel/core/graphs/contributors" target="_blank">awesome</a>
        <a href="https://github.com/phanan/koel/graphs/contributors" target="_blank">contributors</a>.
      </p>

      <p>
        Loving Koel? Please consider supporting its development via
        <a href="https://github.com/users/phanan/sponsorship" target="_blank">GitHub Sponsors</a> and/or
        <a href="https://opencollective.com/koel" target="_blank">OpenCollective</a>.
      </p>
    </div>

    <footer>
      <button class="btn btn-red btn-rounded" @click.prevent="close">Close</button>
    </footer>
  </div>
</template>

<script>
import { sharedStore, userStore } from '@/stores'

export default {
  data: () => ({
    userState: userStore.state,
    sharedState: sharedStore.state
  }),

  computed: {
    latestVersionUrl () {
      return `https://github.com/phanan/koel/releases/tag/${this.sharedState.latestVersion}`
    },

    hasNewVersion () {
      return this.userState.current.is_admin &&
        this.sharedState.currentVersion < this.sharedState.latestVersion
    }
  },

  methods: {
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~#/partials/_vars.scss";

.about {
  text-align: center;
  background: $colorMainBgr;
  max-width: 480px;
  width: 90%;
  border-radius: 8px;
  overflow: hidden;

  [role=content] {
    padding: 24px;
    p {
      margin: 12px 0;
      color: $color2ndText;
    }
  }

  header, footer {
    padding: 12px;
    background: rgba(255, 255, 255, .05);
  }

  header {
    font-size: 1.2rem;
    border-bottom: 1px solid rgba(255, 255, 255, .1);
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
  }

  a {
    color: $colorMainText;

    &:hover {
      color: $colorOrange;
    }
  }
}
</style>

