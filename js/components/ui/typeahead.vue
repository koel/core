<template>
  <div>
    <input type="text" :name="config.name"
      :placeholder="config.placeholder || 'No change'"
      v-model="mutatedValue"
      @keydown.down.prevent="down"
      @keydown.up.prevent="up"
      @change="change"
      @keyup="keyup"
      v-koel-clickaway="hideResults"
      autocomplete="off"
    >
    <ul class="result" v-show="showingResult">
      <li
        v-for="(item, index) in displayedItems"
        :key="index"
        @click.prevent="resultClick">
        {{ item[config.displayKey] }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { filterBy, $ } from '@/utils'

interface TypeAheadItem {
  [key: string]: string
}

export default Vue.extend({
  props: {
    config: Object,
    items: {
      type: Array,
      required: true
    } as PropOptions<TypeAheadItem[]>,
    value: String
  },

  data: () => ({
    filter: '',
    showingResult: false,
    mutatedValue: '',
    lastSelectedValue: ''
  }),

  computed: {
    displayedItems (): TypeAheadItem[] {
      return filterBy(this.items, this.filter, this.config.filterKey)
    }
  },

  methods: {
    down (): void {
      this.showingResult = true
      this.$nextTick((): void => {
        const selected = this.$el.querySelector('.result li.selected')

        if (!selected || !selected.nextElementSibling) {
          // No item selected, or we're at the end of the list.
          // Select the first item now.
          $.addClass(this.$el.querySelector('.result li:first-child'), 'selected')
          selected && $.removeClass(selected, 'selected')
        } else {
          $.removeClass(selected, 'selected')
          $.addClass(selected.nextElementSibling, 'selected')
        }

        this.scrollSelectedIntoView(false)
      })
    },

    up (): void {
      this.showingResult = true
      this.$nextTick((): void => {
        const selected = this.$el.querySelector('.result li.selected')

        if (!selected || !selected.previousElementSibling) {
          $.addClass(this.$el.querySelector('.result li:last-child'), 'selected')
          selected && $.removeClass(selected, 'selected')
        } else {
          $.removeClass(selected, 'selected')
          $.addClass(selected.previousElementSibling, 'selected')
        }

        this.scrollSelectedIntoView(true)
      })
    },

    keyup (e: KeyboardEvent): void {
      /**
       * If it's an UP or DOWN arrow key, stop event bubbling to allow traversing the result dropdown
       */
      if (e.keyCode === 38 || e.keyCode === 40) {
        e.stopPropagation()
        e.preventDefault()
        return
      }

      // If it's an ENTER or TAB key, don't do anything.
      // We've handled ENTER & TAB on keydown.
      if (e.keyCode === 13 || e.keyCode === 9) {
        this.apply()
        return
      }

      // Hide the typeahead results and reset the value if ESC is pressed.
      if (e.keyCode === 27) {
        this.mutatedValue = this.lastSelectedValue
        this.hideResults()
        return
      }

      this.filter = this.mutatedValue
      this.showingResult = true
    },

    change (): void {
      this.apply()
      this.hideResults()
    },

    resultClick (e: MouseEvent): void {
      const selected = this.$el.querySelector('.result li.selected')
      $.removeClass(selected, 'selected')
      $.addClass(e.target as Element, 'selected')
      this.$nextTick(() => this.apply())
    },

    apply (): void {
      const selected = this.$el.querySelector('.result li.selected') as HTMLElement
      this.mutatedValue = (selected && selected.innerText.trim()) || this.mutatedValue
      this.lastSelectedValue = this.mutatedValue
      this.$emit('input', this.mutatedValue)
    },

    /**
     * @param  {boolean} alignTop Whether the item should be aligned to top of its container.
     */
    scrollSelectedIntoView (alignTop: boolean): void {
      const elem = this.$el.querySelector('.result li.selected') as HTMLElement

      if (!elem) {
        return
      }

      const elemRect = elem.getBoundingClientRect()
      const containerRect = elem.offsetParent!.getBoundingClientRect()

      if (elemRect.bottom > containerRect.bottom || elemRect.top < containerRect.top) {
        elem.scrollIntoView(alignTop)
      }
    },

    hideResults (): void {
      this.showingResult = false
    }
  },

  created (): void {
    this.mutatedValue = this.value
    this.filter = this.value
    this.lastSelectedValue = this.value
  }
})
</script>

<style lang="scss" scoped>
@import   "~#/partials/_vars.scss";

.result {
  position: absolute;
  background: #f2f2f2;
  max-height: 96px;
  border-radius: 0 0 3px 3px;
  width: 100%;
  overflow-y: scroll;
  z-index: 1;

  li {
    padding: 2px 8px;

    &.selected, &:hover {
    background: $colorHighlight;
    color: #fff;
    }
  }
}
</style>
