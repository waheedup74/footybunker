<script setup>
const route = useRoute();
console.log("this is route", route.params.playerId);
</script>
<template>
  {{ route.params.playerId }}
</template>
<style scoped></style>
