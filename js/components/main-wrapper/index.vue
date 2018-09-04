<template>
  <div id="mainWrapper">
    <sidebar/>
    <main-content/>
    <extra/>
  </div>
</template>

<script>
export default {
  components: {
    sidebar: () => import('./sidebar/index.vue'),
    mainContent: () => import('./main-content/index.vue'),
    extra: () => import('./extra/index.vue')
  }
}
</script>

<style lang="scss">
@import "~#/partials/_vars.scss";
@import "~#/partials/_mixins.scss";

#mainWrapper {
  display: flex;
  flex: 1;
}
</style>
