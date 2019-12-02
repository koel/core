<template>
  <div class="middle-pane">
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
  }
}
</script>

<style lang="scss">/* no scoping here because we're overriding some plyr classes */
@import "~#/partials/_vars.scss";
@import "~#/partials/_mixins.scss";

.middle-pane {
  flex: 1;
  display: flex;

  @media only screen and (max-width: 768px) {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    height: 8px;

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
    &--seek {
      height: 11px;
      border-bottom: 10px solid transparent; // increase click area
    }
  }

  .plyr__controls {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 0;

    &--left, &--right {
      display: none;
    }
  }

  @media only screen and (max-width: 768px) {
    .meta, .title {
      display: none;
    }
  }
}
</style>
