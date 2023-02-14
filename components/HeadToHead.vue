<script setup>
const testData = ref({});
const testDataa = ref({});
// const { data: headToHead, error: headToHeadError } = useFetch(
//   () =>
//     `https://soccer.sportmonks.com/api/v2.0/head2head/63/71?api_token=yJa5UcHQ0V22MXG9wlpQ3vtf8ucr6GzJJdd0IShA2j5wOSatggY783JolO6J`
// );

onMounted(async () => {
  testData.value = await useFetch(
    () =>
      `https://soccer.sportmonks.com/api/v2.0/head2head/63/71?api_token=yJa5UcHQ0V22MXG9wlpQ3vtf8ucr6GzJJdd0IShA2j5wOSatggY783JolO6J`
  );

  testDataa.value = await useFetch(
    () =>
      `https://soccer.sportmonks.com/api/v2.0/fixtures/18535188?api_token=yJa5UcHQ0V22MXG9wlpQ3vtf8ucr6GzJJdd0IShA2j5wOSatggY783JolO6J`
  );
});
</script>
<template>
  <p class="text-xs bg-green-200">
    {{ testData }}
  </p>

  <p v-if="testDataa.data" class="text-xs bg-rose-200">
    {{ testDataa.data.data.id }}
  </p>
  <!-- <div v-if="testData">
    <div v-for="test in testData.data.data">
      <p class="mb-4">
        {{ test.id }}
      </p>
    </div>
  </div> -->
  <!-- <template v-show="headToHead">
    <div>{{ headToHead.data }}</div>
  </template> -->

  <div class="py-5">
    <!-- <button @click="sendMessage()">Click to send message</button> -->
  </div>
</template>
<style scoped></style>
