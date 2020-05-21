<template>
  <div id="overlay" v-if="state.showing" class="overlay" :class="state.type">
    <div class="display">
      <sound-bar v-if="state.type === 'loading'"/>
      <i class="fa fa-exclamation-circle" v-show="state.type === 'error'"></i>
      <i class="fa fa-exclamation-triangle" v-show="state.type === 'warning'"></i>
      <i class="fa fa-info-circle" v-show="state.type === 'info'"></i>
      <i class="fa fa-check-circle" v-show="state.type === 'success'"></i>

      <span class="message" v-html="state.message"></span>
    </div>

    <button class="btn-dismiss" v-if="state.dismissable" @click.prevent="state.showing = false">Close</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { assign } from 'lodash'
import { eventBus } from '@/utils'
import { events } from '@/config'

export default Vue.extend({
  components: {
    SoundBar: () => import('@/components/ui/sound-bar.vue')
  },

  data: () => ({
    state: {
      showing: true,
      dismissable: false,
      /**
       * Either 'loading', 'success', 'info', 'warning', or 'error'.
       * This dictates the icon as well as possibly other visual appearances.
       */
      type: 'loading',
      message: ''
    }
  }),

  methods: {
    show (options: object): void {
      assign(this.state, options)
      this.state.showing = true
    },

    hide (): void {
      this.state.showing = false
    }
  },

  created (): void {
    eventBus.on({
      [events.SHOW_OVERLAY]: (options: object): void => this.show(options),
      [events.HIDE_OVERLAY]: (): void => this.hide()
    })
  }
})
</script>

<style lang="scss">
@import "~#/partials/_vars.scss";
@import "~#/partials/_mixins.scss";

#overlay {
  background-color: rgba(0, 0, 0, 1);
  flex-direction: column;

  .display {
    @include vertical-center();

    i {
      margin-right: 6px;
    }
  }

  button {
    margin-top: 16px;
  }

  &.error {
    color: $colorRed;
  }

  &.success {
    color: $colorGreen;
  }

  &.info {
    color: $colorBlue;
  }

  &.loading {
    color: $color2ndText;
  }

  &.warning {
    color: $colorOrange;
  }
}
</style>
