/**
 * Add a "infinite scroll" functionality to any component using this mixin.
 * Such a component should have a `scrolling` method bound to `scroll` event on
 * the wrapper element: @scroll="scrolling"
 */
export default {
  components: {
    ToTopButton: () => import('@/components/ui/to-top-button.vue')
  },

  data () {
    return {
      numOfItems: 30,
      perPage: 30
    }
  },

  methods: {
    scrolling ({ target: { scrollTop, clientHeight, scrollHeight }}) {
      // Here we check if the user has scrolled to the end of the wrapper (or 32px to the end).
      // If that's true, load more items.
      if (scrollTop + clientHeight >= scrollHeight - 32) {
        this.displayMore()
      }
    },

    displayMore () {
      this.numOfItems += this.perPage
    }
  }
}
