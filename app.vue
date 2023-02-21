<template>
  <div>
    <NuxtLayout>
      <NuxtPage v-if="!$slots.default" />
    </NuxtLayout>
  </div>
</template>
