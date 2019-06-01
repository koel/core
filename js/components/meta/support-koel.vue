<template>
  <div class="support-bar" v-if="shown">
    <p>
      Loving Koel? Please consider supporting its development via
      <a href="https://github.com/users/phanan/sponsorship" target="_blank">GitHub Sponsors</a> and/or
      <a href="https://opencollective.com/koel" target="_blank">OpenCollective</a>.
    </p>
    <button class="btn-transparent btn-rounded" @click.prevent="close">Hide</button>
    <button class="btn-transparent btn-rounded" @click.prevent="stopBugging">Don't bug me again</button>
  </div>
</template>

<script>
import { event } from '@/utils'
import { preferenceStore as preferences } from '@/stores'

let supportBarTimeoutHandle
const DELAY_UNTIL_SHOWN = 30 * 60 * 1000

export default {
  data: () => ({
    shown: false
  }),

  created () {
    event.on({
      [event.$names.KOEL_READY]: () => preferences.supportBarNoBugging || this.setUpShowBarTimeout()
    })
  },

  methods: {
    setUpShowBarTimeout () {
      supportBarTimeoutHandle = window.setTimeout(() => (this.shown = true), DELAY_UNTIL_SHOWN)
    },

    close () {
      this.shown = false
      window.clearTimeout(supportBarTimeoutHandle)
    },

    stopBugging () {
      preferences.supportBarNoBugging = true
      this.close()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~#/partials/_vars.scss";

.support-bar {
  background: #a33535;
  font-size: .9rem;
  padding: 4px 16px;
  display: flex;
  color: rgba(255, 255, 255, .6);

  p {
    flex: 1;
  }

  a {
    color: #fff;

    &:focus, &:hover {
      color: #fff2bf;
    }
  }

  button {
    padding: 4px 8px;
    font-size: .9rem;

    &:focus, &:hover {
      color: #fff2bf;
    }
  }
}
</style>
