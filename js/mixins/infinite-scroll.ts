import Vue from 'vue'

/**
 * Add a "infinite scroll" functionality to any component using this mixin.
 * Such a component should have a `scrolling` method bound to `scroll` event on
 * the wrapper element: @scroll="scrolling"
 */
export default Vue.extend({
  components: {
    ToTopButton: () => import('@/components/ui/to-top-button.vue')
  },

  data: () => ({
    displayedItemCount: 30,
    perPage: 30
  }),

  methods: {
    scrolling ({ target: { scrollTop, clientHeight, scrollHeight } }:
      { target: { scrollTop: number, clientHeight: number, scrollHeight: number }
    }): void {
      // Here we check if the user has scrolled to the end of the wrapper (or 32px to the end).
      // If that's true, load more items.
      if (scrollTop + clientHeight >= scrollHeight - 32) {
        this.displayMore()
      }
    },

    displayMore (): void {
      this.displayedItemCount += this.perPage
    },

    makeScrollable (container: HTMLElement, totalItemCount: number): void {
      if (container.scrollHeight <= container.clientHeight && this.displayedItemCount < totalItemCount) {
        this.displayMore()
        // we can't use $nextTick here because it's instant and scrollHeight wouldn't have been udpated.
        window.setTimeout((): void => this.makeScrollable(container, totalItemCount), 200)
      }
    }
  }
})
