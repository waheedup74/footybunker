<script setup>
const matches = ref({});

const props = defineProps({
  test: Array,
});

onMounted(async () => {
  matches.value = await useFetch(
    () =>
      `https://soccer.sportmonks.com/api/v2.0/head2head/63/71?api_token=yJa5UcHQ0V22MXG9wlpQ3vtf8ucr6GzJJdd0IShA2j5wOSatggY783JolO6J&include=localTeam,visitorTeam`
  );
});
</script>
<template>
  <div>
    <div
      class="flex justify-between p-2 mb-2 text-sm bg-[#0d406a] text-white rounded"
    >
      <p>HEAD-TO-HEAD MATCHES</p>
    </div>

    <div v-if="test">
      <div v-for="(match, index) in test">
        <div
          class="flex justify-start mb-3 p-1 text-xs rounded border hover:bg-slate-300 hover:cursor-pointer"
          :class="index % 2 === 0 ? 'bg-slate-200' : ''"
        >
          <div class="self-center w-20">
            <p>{{ match.time.starting_at.date }}</p>
          </div>
          <div class="w-full md:w-3/5">
            <div
              class="flex justify-between py-1"
              :class="[
                match.winner_team_id === match.localteam_id
                  ? 'font-bold'
                  : 'font-normal',
              ]"
            >
              <div class="flex justify-start">
                <img
                  :src="match.localTeam.data.logo_path"
                  class="w-6 self-center mr-2"
                  alt=""
                />
                <p class="self-center">{{ match.localTeam.data.name }}</p>
              </div>
              <div>
                <p class="self-center">{{ match.scores.localteam_score }}</p>
              </div>
            </div>
            <div
              class="flex justify-between py-1"
              :class="[
                match.winner_team_id === match.visitorteam_id
                  ? 'font-bold'
                  : 'font-normal',
              ]"
            >
              <div class="flex justify-start">
                <img
                  :src="match.visitorTeam.data.logo_path"
                  class="w-6 self-center mr-2"
                  alt=""
                />
                <p class="self-center">{{ match.visitorTeam.data.name }}</p>
              </div>
              <div>
                <p class="self-center">{{ match.scores.visitorteam_score }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
