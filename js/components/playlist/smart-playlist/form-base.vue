<template>
  <div class="smart-playlist-form">
    <slot/>
  </div>
</template>

<style lang="scss" scoped>
form {
  width: 520px;
}

.rules {
  background: #f2f2f2;
  padding: 12px;
  border-radius: 5px;

  input[type=text], input[type=number], input[type=datetime] {
    display: inline-block;
  }
}
</style>
