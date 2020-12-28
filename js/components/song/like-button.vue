<template>
  <button @click.stop="toggleLike" :title="title">
    <i class="fa fa-heart" v-if="song.liked"></i>
    <i class="fa fa-heart-o" v-else></i>
  </button>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { favoriteStore } from '@/stores'

export default Vue.extend({
  props: {
    song: {
      type: Object,
      required: true
    } as PropOptions<Song>
  },

  computed: {
    title (): string {
      return `${this.song.liked ? 'Unlike' : 'Like'} ${this.song.title} by ${this.song.artist.name}`
    }
  },

  methods: {
    toggleLike () {
      favoriteStore.toggleOne(this.song)
    }
  }
})
</script>

<style lang="scss">
@import "~#/partials/_vars.scss";

button {
  background: transparent;
  padding: 0;
  border: 0;
  color: $color2ndText;

  .fa-heart {
    color: $colorHeart;
  }

  &:hover .fa-heart-o {
    color: $colorHeart;
  }
}
</style>
