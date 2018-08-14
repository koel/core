<template>
  <article id="lyrics">
    <div class="content">
      <template v-if="song.lyrics">
        <div ref="lyricsContainer" v-html="song.lyrics"></div>
        <text-zoomer :target="textZoomTarget"/>
      </template>
      <p class="none" v-if="song.id && !song.lyrics">No lyrics found. Are you not listening to Bach?</p>
    </div>
  </article>
</template>

<script>
import TextZoomer from '@/components/shared/text-zoomer.vue'

export default {
  props: {
    song: {
      type: Object,
      required: true
    }
  },

  components: { TextZoomer },

  data: () => ({
    textZoomTarget: null
  }),

  mounted () {
    // Since Vue's $refs are not reactive, we workaround by assigning to a data property
    this.textZoomTarget = this.$refs.lyricsContainer
  }
}
</script>

<style lang="scss" scoped>
.content {
  line-height: 1.6;
  position: relative;

  .text-zoomer {
    opacity: 0;
    position: absolute;
    top: 0;
    right: 0;
  }

  &:hover .text-zoomer {
    opacity: .5;

    &:hover {
      opacity: 1;
    }
  }
}
</style>
