<template>
  <article id="lyrics">
    <div class="content">
      <div v-show="song.lyrics">
        <div ref="lyricsContainer" v-html="song.lyrics"></div>
        <text-zoomer :target="textZoomTarget"/>
      </div>
      <p class="none" v-if="song.id && !song.lyrics">
        <template v-if="isAdmin">
          No lyrics found. <a @click.prevent="showEditSongForm">Click here</a> to add lyrics.
        </template>
        <span v-else>No lyrics available. Are you listening to Bach?</span>
      </p>
    </div>
  </article>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { event } from '@/utils'
import { userStore } from '@/stores'

export default Vue.extend({
  props: {
    song: {
      type: Object,
      required: true
    } as PropOptions<Song>
  },

  components: {
    TextZoomer: () => import('@/components/ui/text-zoomer.vue')
  },

  data: () => ({
    textZoomTarget: <Element><unknown>null,
    userState: userStore.state
  }),

  methods: {
    showEditSongForm (): void {
      event.emit(event.$names.MODAL_SHOW_EDIT_SONG_FORM, this.song, 'lyrics')
    }
  },

  computed: {
    isAdmin (): boolean {
      return this.userState.current.is_admin
    }
  },

  mounted () {
    // Since Vue's $refs are not reactive, we work around by assigning to a data property
    this.textZoomTarget = <Element>this.$refs.lyricsContainer
  }
})
</script>

<style lang="scss" scoped>
@import "~#/partials/_vars.scss";

.content {
  line-height: 1.6;
  position: relative;

  .none a {
    color: $colorLinkHovered;

    &:hover {
      color: $colorHighlight;
    }
  }

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
