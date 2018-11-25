<template>
  <div id="mainWrapper">
    <sidebar/>
    <main-content/>
    <extra-panel/>
    <modal-wrapper/>
  </div>
</template>

<script>
export default {
  components: {
    Sidebar: () => import('@/components/layout/main-wrapper/sidebar.vue'),
    MainContent: () => import('@/components/layout/main-wrapper/main-content.vue'),
    ExtraPanel: () => import('@/components/layout/main-wrapper/extra-panel.vue'),
    ModalWrapper: () => import('@/components/layout/modal-wrapper.vue')
  }
}
</script>

<style lang="scss">
#mainWrapper {
  display: flex;
  flex: 1;
}
</style>
