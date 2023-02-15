<script setup>
const props = defineProps({
  commentary: Array,
});
</script>
<template>
  <div v-if="commentary">
    <div v-for="com in commentary">
      <div class="mb-4 text-xs">
        <div class="font-semibold mr-3">
          {{ com.minute }}'
          <span v-if="com.extra_minute">+ ({{ com.extra_minute }})</span>
        </div>
        <div :class="com.important ? 'bg-slate-200' : ''">
          {{ com.comment }}
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
