<script setup lang="ts">
const route = useRoute();

const goto = function (league: any) {
  navigateTo(`/${league}-standings`);
};
</script>

<template>
  <div class="mt-5">
    <a class="bg-green-400 py-3 px-6 mr-5" @click="goto('Premier-league')"
      >leagues page</a
    >
  </div>
</template>
