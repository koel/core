<template>
  <div class="edit-song">
    <sound-bar v-if="loading"/>
    <form v-else @submit.prevent="submit">
      <header>
        <img :src="coverUrl" width="96" height="96">
        <hgroup class="meta">
          <h1 :class="{ mixed: !editingOnlyOneSong }">{{ displayedTitle }}</h1>
          <h2 :class="{ mixed: !allSongsAreFromSameArtist && !formData.artistName }">{{ displayedArtistName }}</h2>
          <h2 :class="{ mixed: !allSongsAreInSameAlbum && !formData.albumName }">{{ displayedAlbumName }}</h2>
        </hgroup>
      </header>

      <div>
        <div class="tabs tabs-white">
          <div class="header clear">
            <a @click.prevent="currentView = 'details'"
              class="tab-details"
              :class="{ active: currentView === 'details' }">Details</a>
            <a @click.prevent="currentView = 'lyrics'"
              v-if="editingOnlyOneSong"
              class="tab-lyrics"
              :class="{ active: currentView === 'lyrics' }">Lyrics</a>
          </div>

          <div class="panes">
            <div v-show="currentView === 'details'">
              <div class="form-row" v-if="editingOnlyOneSong">
                <label>Title</label>
                <input title="Title" name="title" type="text" v-model="formData.title">
              </div>
              <div class="form-row">
                <label>Artist</label>
                <typeahead
                  :items="artistState.artists"
                  :options="artistTypeaheadOptions"
                  v-model="formData.artistName"/>
              </div>
              <div class="form-row">
                <label>Album</label>
                <typeahead
                  :items="albumState.albums"
                  :options="albumTypeaheadOptions"
                  v-model="formData.albumName"/>
              </div>
              <div class="form-row">
                <label class="small">
                  <input type="checkbox" @change="changeCompilationState" ref="compilationStateChk" />
                  Album is a compilation of songs by various artists
                </label>
              </div>
              <div class="form-row" v-show="editingOnlyOneSong">
                <label>Track</label>
                <input name="track" type="text" pattern="\d*" v-model="formData.track"
                title="Empty or a number">
              </div>
            </div>
            <div v-if="editingOnlyOneSong" v-show="currentView === 'lyrics'">
              <div class="form-row">
                <textarea title="Lyrics" name="lyrics" v-model="formData.lyrics"></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer>
        <button type="submit" class="btn btn-blue">Update</button>
        <a @click.prevent="close" class="btn btn-white btn-cancel">Cancel</a>
      </footer>
    </form>
  </div>
</template>

<script>
import { union } from 'lodash'

import { br2nl } from '@/utils'
import { songInfo } from '@/services/info'
import { artistStore, albumStore, songStore } from '@/stores'
import { getDefaultCover } from '@/utils'

const COMPILATION_STATES = {
  NONE: 0, // No songs belong to a compilation album
  ALL: 1, // All songs belong to compilation album(s)
  SOME: 2 // Some of the songs belong to compilation album(s)
}

export default {
  components: {
    SoundBar: () => import('@/components/ui/sound-bar.vue'),
    Typeahead: () => import('@/components/ui/typeahead.vue')
  },

  props: {
    songs: {
      required: true,
      type: [Array, Object]
    }
  },

  data () {
    return {
      mutatedSongs: [],
      currentView: '',
      loading: true,

      artistState: artistStore.state,
      artistTypeaheadOptions: {
        displayKey: 'name',
        filterKey: 'name',
        name: 'artist'
      },

      albumState: albumStore.state,
      albumTypeaheadOptions: {
        displayKey: 'name',
        filterKey: 'name',
        name: 'album'
      },

      /**
       * In order not to mess up the original songs, we manually assign and manipulate
       * their attributes.
       *
       * @type {Object}
       */
      formData: {
        title: '',
        albumName: '',
        artistName: '',
        lyrics: '',
        track: '',
        compilationState: null
      }
    }
  },

  computed: {
    editingOnlyOneSong () {
      return this.mutatedSongs.length === 1
    },

    allSongsAreFromSameArtist () {
      return this.mutatedSongs.every(song => song.artist.id === this.mutatedSongs[0].artist.id)
    },

    allSongsAreInSameAlbum () {
      return this.mutatedSongs.every(song => song.album.id === this.mutatedSongs[0].album.id)
    },

    coverUrl () {
      return this.allSongsAreInSameAlbum ? this.mutatedSongs[0].album.cover : getDefaultCover()
    },

    compilationState () {
      const albums = this.mutatedSongs.reduce((acc, song) => union(acc, [song.album]), [])
      const compiledAlbums = albums.filter(album => album.is_compilation)

      if (!compiledAlbums.length) {
        this.formData.compilationState = COMPILATION_STATES.NONE
      } else if (compiledAlbums.length === albums.length) {
        this.formData.compilationState = COMPILATION_STATES.ALL
      } else {
        this.formData.compilationState = COMPILATION_STATES.SOME
      }

      return this.formData.compilationState
    },

    displayedTitle () {
      return this.editingOnlyOneSong ? this.formData.title : `${this.mutatedSongs.length} songs selected`
    },

    displayedArtistName () {
      return this.allSongsAreFromSameArtist || this.formData.artistName
        ? this.formData.artistName
        : 'Mixed Artists'
    },

    displayedAlbumName () {
      return this.allSongsAreInSameAlbum || this.formData.albumName
        ? this.formData.albumName
        : 'Mixed Albums'
    }
  },

  methods: {
    async open () {
      this.mutatedSongs = [].concat(this.songs)
      this.currentView = 'details'

      if (this.editingOnlyOneSong) {
        this.formData.title = this.mutatedSongs[0].title
        this.formData.albumName = this.mutatedSongs[0].album.name
        this.formData.artistName = this.mutatedSongs[0].artist.name

        // If we're editing only one song and the song's info (including lyrics)
        // hasn't been loaded, load it now.
        if (!this.mutatedSongs[0].infoRetrieved) {
          this.loading = true

          await songInfo.fetch(this.mutatedSongs[0])
          this.loading = false
          this.formData.lyrics = br2nl(this.mutatedSongs[0].lyrics)
          this.formData.track = this.mutatedSongs[0].track || ''
          this.initCompilationStateCheckbox()
        } else {
          this.loading = false
          this.formData.lyrics = br2nl(this.mutatedSongs[0].lyrics)
          this.formData.track = this.mutatedSongs[0].track || ''
          this.initCompilationStateCheckbox()
        }
      } else {
        this.formData.albumName = this.allSongsAreInSameAlbum ? this.mutatedSongs[0].album.name : ''
        this.formData.artistName = this.allSongsAreFromSameArtist ? this.mutatedSongs[0].artist.name : ''
        this.loading = false
        this.initCompilationStateCheckbox()
      }
    },

    initCompilationStateCheckbox () {
      // This must be wrapped in a $nextTick callback, because the form is dynamically
      // attached into DOM in conjunction with `this.loading` data binding.
      this.$nextTick(() => {
        const chk = this.$refs.compilationStateChk

        switch (this.compilationState) {
          case COMPILATION_STATES.ALL:
            chk.checked = true
            chk.indeterminate = false
            break
          case COMPILATION_STATES.NONE:
            chk.checked = false
            chk.indeterminate = false
            break
          default:
            chk.checked = false
            chk.indeterminate = true
            break
        }
      })
    },

    /**
     * Manually set the compilation state.
     * We can't use v-model here due to the tri-state nature of the property.
     * Also, following iTunes style, we don't support circular switching of the states -
     * once the user clicks the checkbox, there's no going back to indeterminate state.
     */
    changeCompilationState (e) {
      this.formData.compilationState = e.target.checked ? COMPILATION_STATES.ALL : COMPILATION_STATES.NONE
    },

    close () {
      this.$emit('close')
    },

    async submit () {
      this.loading = true

      try {
        await songStore.update(this.mutatedSongs, this.formData)
        this.close()
      } finally {
        this.loading = false
      }
    }
  },

  async created () {
    await this.open()
  }
}
</script>

<style lang="scss" scoped>
form {
  > header {
    img {
      flex: 0 0 96px;
    }

    .meta {
      flex: 1;
      padding-left: 8px;

      .mixed {
        opacity: .5;
      }
    }
  }
}
</style>
