<template>
  <article id="lyrics">
    <div class="content">
      <div v-if="song.lyrics" v-html="song.lyrics"/>
      <p class="none" v-if="song.id && !song.lyrics">No lyrics found. Are you not listening to Bach?</p>
    </div>
  </article>
</template>

<script>
export default {
  props: {
    song: {
      type: Object,
      required: true
    }
  }
}
</script>
