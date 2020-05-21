<template>
  <nav>
    <ul
      :class="extraClass"
      :style="{ top: `${top}px`, left: `${left}px` }"
      @contextmenu.prevent
      class="menu"
      ref="menu"
      tabindex="-1"
      v-koel-clickaway="close"
      v-show="shown"
    >
      <slot>Menu items go here.</slot>
    </ul>
  </nav>
</template>

<script lang="ts">
import { eventBus } from '@/utils'
import { events } from '@/config'
import Vue from 'vue'

export default Vue.extend({
  props: {
    extraClass: {
      required: false,
      type: String
    }
  },

  data: () => ({
    shown: false,
    top: 0,
    left: 0
  }),

  methods: {
    open (top = 0, left = 0): void {
      this.notifyOtherInstancesToClose()

      this.top = top
      this.left = left
      this.shown = true

      this.preventOffScreen(this.$refs.menu as HTMLElement)
    },

    close (): void {
      if (!this.$refs.menu) {
        return
      }

      this.closeAllSubmenus()
      ;(this.$refs.menu as HTMLElement).style.top = 'auto'
      ;(this.$refs.menu as HTMLElement).style.bottom = 'auto'
      this.shown = false
    },

    notifyOtherInstancesToClose: (): void => {
      eventBus.emit(events.CONTEXT_MENU_OPENING)
    },

    preventOffScreen: (element: HTMLElement): void => {
      Vue.nextTick((): void => {
        if (element.getBoundingClientRect().bottom > window.innerHeight) {
          element.style.top = 'auto'
          element.style.bottom = '0'
        } else {
          element.style.bottom = 'auto'
        }
      })
    },

    closeAllSubmenus (): void {
      Array.from(this.$el.querySelectorAll('.submenu') as NodeListOf<HTMLElement>).forEach((el: HTMLElement): void => {
        el.style.display = 'none'
      })
    }
  },

  /**
   * On component mounted(), we use some JavaScript to prepare the submenu triggering.
   * With this, we can catch when the submenus shown or hidden, and can make sure
   * they don't appear off-screen.
   */
  mounted (): void {
    Array.from(this.$el.querySelectorAll('.has-sub') as NodeListOf<HTMLElement>).forEach((item: HTMLElement): void => {
      const submenu = item.querySelector('.submenu') as HTMLElement

      if (!submenu) {
        return
      }

      item.addEventListener('mouseenter', (): void => {
        submenu.style.display = 'block'
        this.preventOffScreen(submenu)
      })

      item.addEventListener('mouseleave', (): void => {
        submenu.style.top = '0'
        submenu.style.bottom = 'auto'
        submenu.style.display = 'none'
      })
    })
  },

  created (): void {
    eventBus.on(events.CONTEXT_MENU_OPENING, (): void => {
      if (this.shown) {
        this.close()
      }
    })
  }
})
</script>

<style lang="scss" scoped>
@import "~#/partials/_vars.scss";
@import "~#/partials/_mixins.scss";

.menu {
  @include context-menu();
  position: fixed;

  li {
    position: relative;
    padding: 4px 12px;
    cursor: default;
    white-space: nowrap;

    &:hover {
      background: $colorOrange;
      color: #fff;
    }

    &.separator {
      pointer-events: none;
      padding: 1px 0;
      background: lighten($colorMenuBgr, 10%);
    }

    &.has-sub {
      padding-right: 24px;

      &:after {
        position: absolute;
        right: 12px;
        top: 4px;
        content: "‎▶";
        font-size: .9rem;
        width: 16px;
        text-align: right;
      }
    }
  }

  .submenu {
    position: absolute;
    display: none;
    left: 100%;
    top: 0;
  }
}
</style>
