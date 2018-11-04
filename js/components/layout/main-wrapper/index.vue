<template>
  <div id="mainWrapper">
    <sidebar/>
    <main-content/>
    <extra-panel/>
  </div>
</template>

<script>
export default {
  components: {
    Sidebar: () => import('@/components/layout/main-wrapper/sidebar.vue'),
    mainContent: () => import('@/components/layout/main-wrapper/main-content.vue'),
    ExtraPanel: () => import('@/components/layout/main-wrapper/extra-panel.vue')
  }
}
</script>

<style lang="scss">
#mainWrapper {
  display: flex;
  flex: 1;
}
</style>
