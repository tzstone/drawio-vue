<template>
  <div id="app" class="app">
    <RouterView></RouterView>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from '@vue/composition-api';
import RouterView from 'vue-router';

export default defineComponent({
  name: 'App',
  setup(props, ctx) {
    onMounted(() => {

    })

    onUnmounted(() => {
    })

    return {
    }
  }
})
</script>

<style>

</style>
