<script setup>
const props = defineProps({
  videos: Array,
});
</script>
<template>
  <div v-if="videos.length">
    <!-- {{ videos.length }} -->
    <div v-for="video in videos">
      <video
        class="w-4/5 mx-auto h-full border p-3 mt-5 rounded shadow-md"
        controls
        muted
      >
        <source :src="video.location" />
        Your browser does not support the video tag.
      </video>
    </div>
  </div>
  <div v-else>
    <p>No video data available for this match.</p>
  </div>
</template>
<style></style>
<!-- https://www.g-video.tv/47316472.mp4 -->
