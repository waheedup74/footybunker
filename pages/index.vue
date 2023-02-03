<script setup lang="ts">
const route = useRoute();

const goto = function (league: any) {
  navigateTo(`/${league}-standings`);
};
</script>

<template>
  <div class="mt-5">
    <div>
      <p class="text-center py-5 text-3xl text-white bg-rose-500">
        This is landing page
      </p>
    </div>
    <div class="mt-5 text-center">
      <a
        class="bg-green-400 py-3 px-6 mr-5 cursor-pointer"
        @click="goto('Premier-league')"
        >GoTo Premier league Standings
      </a>
    </div>
  </div>
</template>
