<script setup>
const route = useRoute();
const fixtureId = parseInt(route.params.fixture);
let tab_id = ref("A");

// ${route.params.fixture}
// GET Team fixture stats using and Team Id and range of dates
const { data: fixDetail, error: featuresError } = useFetch(
  () =>
    `https://soccer.sportmonks.com/api/v2.0/fixtures/18535188?api_token=yJa5UcHQ0V22MXG9wlpQ3vtf8ucr6GzJJdd0IShA2j5wOSatggY783JolO6J&include=stats,localTeam,visitorTeam,highlights,events,lineup,referee,venue`
);

const changeTabs = function (tab, type) {
  tab_id.value = tab;
};
</script>

<template>
  <div class="w-11/12 md:w-4/5 mx-auto p-5" v-if="fixDetail">
    <div class="grid grid-cols-3 border-b pb-6">
      <div class="text-center self-center">
        <img
          :src="fixDetail.data.localTeam.data.logo_path"
          class="w-16 md:w-32 border p-3 mx-auto rounded"
          alt=""
        />

        <p class="mt-3 font-semibold">
          {{ fixDetail.data.localTeam.data.name }}
        </p>
      </div>
      <div class="text-center font-medium self-center">
        <div>{{ fixDetail.data.time.starting_at.date_time }}</div>
        <div class="text-4xl md:text-6xl lining-nums">
          {{ fixDetail.data.scores.localteam_score }} -
          {{ fixDetail.data.scores.visitorteam_score }}
        </div>
      </div>
      <div class="text-center self-center">
        <img
          :src="fixDetail.data.visitorTeam.data.logo_path"
          class="w-16 md:w-32 border p-3 mx-auto rounded"
          alt=""
        />
        <p class="mt-3 font-semibold">
          {{ fixDetail.data.visitorTeam.data.name }}
        </p>
      </div>
    </div>

    <div class="py-2 border-b">
      <div class="flex justify-start flex-wrap uppercase text-sm">
        <div
          @click="changeTabs('A')"
          :class="[
            tab_id === 'A' ? 'bg-[#0d406a] font-medium' : 'bg-white text-black',
          ]"
          class="mr-3 px-5 py-2 bg-[#0d406a] text-white text-center cursor-pointer rounded"
        >
          Summary
        </div>
        <div
          @click="changeTabs('B')"
          :class="[
            tab_id === 'B' ? 'bg-[#0d406a] font-medium' : 'bg-white text-black',
          ]"
          class="mr-3 px-5 py-2 bg-[#0d406a] text-white text-center cursor-pointer rounded"
        >
          Stats
        </div>
        <div
          @click="changeTabs('C')"
          :class="[
            tab_id === 'C' ? 'bg-[#0d406a] font-medium' : 'bg-white text-black',
          ]"
          class="mr-3 px-5 py-2 bg-[#0d406a] text-white text-center cursor-pointer rounded"
        >
          Lineup
        </div>
        <div
          @click="changeTabs('D')"
          :class="[
            tab_id === 'D' ? 'bg-[#0d406a] font-medium' : 'bg-white text-black',
          ]"
          class="mr-3 px-5 py-2 bg-[#0d406a] text-white text-center cursor-pointer rounded"
        >
          commentary
        </div>
      </div>
    </div>

    <div v-if="tab_id === 'A'" class="text-sm">
      <div v-if="fixDetail.data.events.data.length !== 0">
        <div
          class="flex justify-between p-2 mb-2 text-sm bg-[#0d406a] text-white rounded"
        >
          <p>1st Half</p>
          <p>{{ fixDetail.data.scores.ht_score }}</p>
        </div>

        <div class="grid mb-2">
          <div>
            <div v-for="e in fixDetail.data.events.data">
              <div
                v-if="
                  e.team_id == fixDetail.data.localteam_id && e.minute <= 45
                "
              >
                <span class="mr-2">{{ e.minute }}' </span>
                <span class="mr-2">{{ e.player_name }}</span>
                <span class="mr-2">{{ e.type }}</span>
              </div>
              <div
                class="flex justify-end"
                v-if="
                  e.team_id == fixDetail.data.visitorteam_id && e.minute <= 45
                "
              >
                <span class="mr-2">{{ e.type }}</span>
                <span class="mr-2">{{ e.player_name }}</span>
                <span class="mr-2">{{ e.minute }}' </span>
              </div>
            </div>
          </div>
        </div>

        <div
          class="flex justify-between p-2 mb-2 text-sm bg-[#0d406a] text-white rounded"
        >
          <p>2nd Half</p>
          <p
            v-if="
              fixDetail.data.scores.ht_score !== fixDetail.data.scores.ft_score
            "
          >
            {{ fixDetail.data.scores.ft_score }}
          </p>
          <p v-else>0-0</p>
        </div>

        <div class="grid mb-2">
          <div v-for="e in fixDetail.data.events.data">
            <div
              v-if="e.team_id == fixDetail.data.localteam_id && e.minute > 45"
            >
              <span class="mr-2">{{ e.minute }}' </span>
              <span class="mr-2">{{ e.player_name }}</span>
              <span class="mr-2">{{ e.type }}</span>
            </div>
            <div
              class="flex justify-end"
              v-if="e.team_id == fixDetail.data.visitorteam_id && e.minute > 45"
            >
              <span class="mr-2">{{ e.type }}</span>
              <span class="mr-2">{{ e.player_name }}</span>
              <span class="mr-2">{{ e.minute }}' </span>
            </div>
          </div>
        </div>

        <div
          class="flex justify-between p-2 mb-2 text-sm bg-[#0d406a] text-white rounded"
        >
          <p>MATCH INFORMATION</p>
        </div>

        <div class="text-sm">
          <div class="flex justify-between">
            <p>REFEREE</p>
            <p>{{ fixDetail.data.referee.data.common_name }}</p>
          </div>
          <div class="flex justify-between">
            <p>VENUE</p>
            <p>{{ fixDetail.data.venue.data.name }}</p>
          </div>
          <div class="flex justify-between" v-if="fixDetail.data.attendance">
            <p>ATTENDANCE</p>
            <p>{{ fixDetail.data.attendance }}</p>
          </div>
        </div>
      </div>
    </div>
    <div v-if="tab_id === 'B'">
      <div class="mt-3" v-if="fixDetail.data.stats.data.length !== 0">
        <div class="" v-for="stats in fixDetail.data.stats.data">
          <div class="grid grid-cols-3">
            <div
              class="bg-gray-500"
              v-if="fixDetail.data.localteam_id === stats.team_id"
            >
              <p>{{ stats.possessiontime }}</p>
            </div>

            <div
              class="bg-gray-500"
              v-if="fixDetail.data.visitorteam_id === stats.team_id"
            >
              <p>{{ stats.possessiontime }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="tab_id === 'C'">C</div>
    <div v-if="tab_id === 'D'">D</div>
  </div>
</template>

<style scoped>
* {
  font-family: Arial, sans-serif;
}
</style>
