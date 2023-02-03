<script setup>
const route = useRoute();
const fixtureId = parseInt(route.params.fixture);
// GET Team fixture stats using and Team Id and range of dates
const { data: fixDetail, error: featuresError } = useFetch(
  () =>
    `https://soccer.sportmonks.com/api/v2.0/fixtures/${route.params.fixture}?api_token=yJa5UcHQ0V22MXG9wlpQ3vtf8ucr6GzJJdd0IShA2j5wOSatggY783JolO6J&include=localTeam,visitorTeam`
);
</script>

<template>
  <div class="mt-5" v-if="fixDetail">
    <div class="flex justify-between">
      <img :src="fixDetail.data.localTeam.data.logo_path" class="w-32" alt="" />
      <img
        :src="fixDetail.data.visitorTeam.data.logo_path"
        class="w-32"
        alt=""
      />
    </div>
  </div>
</template>
