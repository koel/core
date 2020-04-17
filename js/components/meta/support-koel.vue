<template>
  <div class="support-bar" v-if="shown">
    <p>
      Loving Koel? Please consider supporting its development via
      <a href="https://github.com/users/phanan/sponsorship" target="_blank">GitHub Sponsors</a> and/or
      <a href="https://opencollective.com/koel" target="_blank">OpenCollective</a>.
    </p>
    <btn transparent rounded @click.prevent="close">Hide</btn>
    <btn transparent rounded @click.prevent="stopBugging">Don't bug me again</btn>
  </div>
</template>

<script>
import { event } from '@/utils'
import { preferenceStore as preferences } from '@/stores'
import isMobile from 'ismobilejs'

const DELAY_UNTIL_SHOWN = 30 * 60 * 1000

export default {
  components: {
    Btn: () => import('@/components/ui/btn')
  },

  data: () => ({
    shown: false
  }),

  created () {
    event.on({
      [event.$names.KOEL_READY]: () => {
        if (isMobile.any || preferences.supportBarNoBugging) {
          return
        }

        this.setUpShowBarTimeout()
      }
    })
  },

  methods: {
    setUpShowBarTimeout () {
      this.$options.$SUPPORT_BAR_TIMEOUT_HANDLE = window.setTimeout(() => (this.shown = true), DELAY_UNTIL_SHOWN)
    },

    close () {
      this.shown = false
      window.clearTimeout(this.$options.$SUPPORT_BAR_TIMEOUT_HANDLE)
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
  z-index: 9;

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
