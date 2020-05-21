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

<script lang="ts">
import isMobile from 'ismobilejs'
import Vue from 'vue'
import { eventBus } from '@/utils'
import { events } from '@/config'
import { preferenceStore as preferences } from '@/stores'

const DELAY_UNTIL_SHOWN: number = 30 * 60 * 1000
let SUPPORT_BAR_TIMEOUT_HANDLE: number = 0

export default Vue.extend({
  components: {
    Btn: () => import('@/components/ui/btn.vue')
  },

  data: () => ({
    shown: false,
    $SUPPORT_BAR_TIMEOUT_HANDLE: null
  }),

  created (): void {
    eventBus.on({
      [events.KOEL_READY]: (): void => {
        if (isMobile.any || preferences.supportBarNoBugging) {
          return
        }

        this.setUpShowBarTimeout()
      }
    })
  },

  methods: {
    setUpShowBarTimeout (): void {
      SUPPORT_BAR_TIMEOUT_HANDLE = window.setTimeout(() => (this.shown = true), DELAY_UNTIL_SHOWN)
    },

    close (): void {
      this.shown = false
      window.clearTimeout(SUPPORT_BAR_TIMEOUT_HANDLE)
    },

    stopBugging (): void {
      preferences.supportBarNoBugging = true
      this.close()
    }
  }
})
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
