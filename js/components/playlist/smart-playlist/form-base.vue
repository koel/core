<template>
  <div class="smart-playlist-form">
    <slot/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>

<style lang="scss" scoped>
form {
  width: 520px;
}

.rules {
  background: rgba(0, 0, 0, .1);
  padding: 12px;
  border-radius: 5px;

  input[type=text], input[type=number], input[type=datetime] {
    display: inline-block;
  }
}
</style>
