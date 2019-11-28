<template>
  <div class="middle-pane">
    <span class="album-thumb" v-if="cover" :style="{ backgroundImage: `url('${cover}')` }"></span>

    <div class="progress" id="progressPane">
      <h3 class="title">{{ song.title }}</h3>
      <p class="meta">
        <a class="artist" :href="`#!/artist/${song.artist.id}`">{{ song.artist.name }}</a> –
        <a class="album" :href="`#!/album/${song.album.id}`">{{ song.album.name }}</a>
      </p>

      <div class="plyr">
        <audio crossorigin="anonymous" controls></audio>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    song: {
      required: true,
      type: Object
    }
  },

  computed: {
    cover () {
      return this.song.album.cover
    }
  }
}
</script>

<style lang="scss">/* no scoping here because we're overriding some plyr classes */
@import "~#/partials/_vars.scss";
@import "~#/partials/_mixins.scss";

.middle-pane {
  flex: 1;
  display: flex;

  .album-thumb {
    flex: 0 0 $footerHeight;
    height: 100%;
    background-size: cover;
    position: relative;
  }

  @media only screen and (max-width: 768px) {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    height: 8px;

    .album-thumb {
      display: none;
    }

    ::before {
      display: none;
    }
  }
}

#progressPane {
  flex: 1;
  text-align: center;
  padding-top: 16px;
  line-height: 18px;
  background: rgba(1, 1, 1, .2);
  position: relative;

  .meta {
    font-size: .9rem;

    a {
      &:hover {
        color: $colorHighlight;
      }
    }
  }

  // Some little tweaks here and there
  .plyr {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  .plyr__progress {
    overflow: hidden;
    height: 1px;

    html.touch &, .middle-pane:hover & {
      overflow: visible;
      height: $plyr-volume-track-height;
    }
  }

  .plyr__controls {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 0;
  }

  .plyr__controls--left, .plyr__controls--right {
    display: none;
  }

  @media only screen and (max-width: 768px) {
    .meta, .title {
      display: none;
    }

    top: -15px;
    padding-top: 0;
    width: 100%;
    position: absolute;

    .plyr {
      &__progress {
        height: 16px;

        &--buffer[value],
        &--played[value],
        &--seek[type='range'] {
          height: 16px;
        }
      }
    }
  }
}
</style>
