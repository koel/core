<template>
  <ul class="menu"
    :class="extraClass"
    v-show="shown"
    tabindex="-1"
    @contextmenu.prevent
    :style="{ top: `${top}px`, left: `${left}px` }"
    v-koel-clickaway="close"
  >
    <slot>Menu items to go here.</slot>
  </ul>
</template>

<script>
import { event } from '@/utils'

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

      // Make sure the menu isn't off-screen
      if (this.$el.getBoundingClientRect().bottom > window.innerHeight) {
        this.$el.style.top = 'auto'
        this.$el.style.bottom = 0
      } else {
        this.$el.style.top = this.top
        this.$el.style.bottom = 'auto'
      }
    },

    close () {
      Array.from(this.$el.querySelectorAll('.submenu')).forEach(el => (el.style.display = 'none'))
      this.shown = false
    },

    notifyOtherInstancesToClose () {
      event.emit(event.$names.CONTEXT_MENU_OPENING)
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

      item.addEventListener('mouseenter', e => {
        submenu.style.display = 'block'

        // Make sure the submenu isn't off-screen
        if (submenu.getBoundingClientRect().bottom > window.innerHeight) {
          submenu.style.top = 'auto'
          submenu.style.bottom = 0
        }
      })

      item.addEventListener('mouseleave', e => {
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
