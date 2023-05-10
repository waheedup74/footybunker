<template>
  <div class="h-screen overflow-y-scroll pb-10">
    <TopHeader />
    <slot />

    <div class="bottom-0">
      <MainFooter />
    </div>
  </div>
</template>

<style scoped>
* {
  font-family: "CircularaStd-Book", sans-serif;
}
</style>
