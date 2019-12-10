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

<script>
import { event } from '@/utils'
import Vue from 'vue'

export default {
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
    open (top = 0, left = 0) {
      this.notifyOtherInstancesToClose()

      this.top = top
      this.left = left
      this.shown = true

      this.preventOffScreen(this.$refs.menu)
    },

    close () {
      if (!this.$refs.menu) {
        return
      }

      this.closeAllSubmenus()
      this.$refs.menu.style.top = 'auto'
      this.$refs.menu.style.bottom = 'auto'
      this.shown = false
    },

    notifyOtherInstancesToClose: () => event.emit(event.$names.CONTEXT_MENU_OPENING),

    preventOffScreen: element => {
      Vue.nextTick(() => {
        if (element.getBoundingClientRect().bottom > window.innerHeight) {
          element.style.top = 'auto'
          element.style.bottom = 0
        } else {
          element.style.bottom = 'auto'
        }
      })
    },

    closeAllSubmenus () {
      Array.from(this.$el.querySelectorAll('.submenu')).forEach(el => {
        el.style.display = 'none'
      })
    }
  },

  /**
   * On component mounted(), we use some JavaScript to prepare the submenu triggering.
   * With this, we can catch when the submenus shown or hidden, and can make sure
   * they don't appear off-screen.
   */
  mounted () {
    Array.from(this.$el.querySelectorAll('.has-sub')).forEach(item => {
      const submenu = item.querySelector('.submenu')

      if (!submenu) {
        return
      }

      item.addEventListener('mouseenter', () => {
        submenu.style.display = 'block'
        this.preventOffScreen(submenu)
      })

      item.addEventListener('mouseleave', () => {
        submenu.style.top = 0
        submenu.style.bottom = 'auto'
        submenu.style.display = 'none'
      })
    })
  },

  created () {
    event.on(event.$names.CONTEXT_MENU_OPENING, () => {
      if (this.shown) {
        this.close()
      }
    })
  }
}
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
      background: #ccc;
    }

    &.has-sub {
      padding-right: 24px;

      &:after {
        position: absolute;
        right: 12px;
        top: 4px;
        content: "▸";
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
