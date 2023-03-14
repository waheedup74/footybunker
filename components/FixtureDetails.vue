<script setup>
const route = useRoute();
const matches = ref({});
const fixture = ref({});
const commentary = ref({});
const fixtureId = parseInt(route.params.fixture);
const localTeam = ref(0);
const visitorTeam = ref(0);

const top_tab_id = ref("match");
const localTeamFormation = ref({});
const visitorTeamFormation = ref({});

// // GET Team fixture stats using and Team Id and range of dates
// const { data: fixDetail, error: fixturesError } = useFetch(
//   () =>
//     `https://soccer.sportmonks.com/api/v2.0/fixtures/18535188?api_token=yJa5UcHQ0V22MXG9wlpQ3vtf8ucr6GzJJdd0IShA2j5wOSatggY783JolO6J&include=stats,localTeam,visitorTeam,highlights,events,lineup.player.country,referee,venue,substitutions.player.country`
// );

onBeforeMount(async () => {
  fixture.value = await useFetch(
    () =>
      `https://soccer.sportmonks.com/api/v2.0/fixtures/${fixtureId}?api_token=yJa5UcHQ0V22MXG9wlpQ3vtf8ucr6GzJJdd0IShA2j5wOSatggY783JolO6J&include=stats,localTeam,visitorTeam,events,referee,lineup.player.country,substitutions.player.country,venue,highlights`
  );

  if (fixture.value.data) {
    localTeam.value = fixture.value?.data.data.localteam_id;
    visitorTeam.value = fixture.value?.data.data.visitorteam_id;
    matches.value = await useFetch(
      () =>
        `https://soccer.sportmonks.com/api/v2.0/head2head/${localTeam.value}/${visitorTeam.value}?api_token=yJa5UcHQ0V22MXG9wlpQ3vtf8ucr6GzJJdd0IShA2j5wOSatggY783JolO6J&include=localTeam,visitorTeam`
    );
  }
});

const changeTopTabs = function (tab, type) {
  top_tab_id.value = tab;
};

const teamStats = (team_id) => {
  navigateTo(`teamStats-${team_id}`);
  // console.log("what is id?", team_id);
};
</script>

<template>
  <div class="w-9/10 md:w-4/5 mx-auto p-5">
    <!-- add section -->
    <div
      class="bg-rose-500 text-white rounded-lg py-2 px-2 mb-5 transition delay-150 duration-300 ease-in-out"
    >
      <div class="flex justify-between py-5">
        <p class="text-3xl">Ad display here</p>
      </div>
    </div>
    <!-- add section -->
    <div class="grid grid-cols-3 border-b pb-6" v-if="fixture.data">
      <div
        class="text-center self-center cursor-pointer"
        @click="teamStats(fixture.data.data.localteam_id)"
      >
        <img
          :src="fixture.data.data.localTeam.data.logo_path"
          class="w-16 md:w-32 border p-3 mx-auto rounded"
          alt=""
        />

        <p class="mt-3 font-semibold">
          {{ fixture.data.data.localTeam.data.name }}
        </p>
      </div>
      <div class="text-center font-medium self-center">
        <div>{{ fixture.data.data.time.starting_at.date_time }}</div>
        <div class="text-4xl md:text-6xl lining-nums">
          {{ fixture.data.data.scores.localteam_score }} -
          {{ fixture.data.data.scores.visitorteam_score }}
        </div>
      </div>
      <div
        class="text-center self-center cursor-pointer"
        @click="teamStats(fixture.data.data.visitorteam_id)"
      >
        <img
          :src="fixture.data.data.visitorTeam.data.logo_path"
          class="w-16 md:w-32 border p-3 mx-auto rounded"
          alt=""
        />
        <p class="mt-3 font-semibold">
          {{ fixture.data.data.visitorTeam.data.name }}
        </p>
      </div>
    </div>

    <div class="py-2 border-b">
      <div class="flex justify-start flex-wrap uppercase text-sm">
        <div
          @click="changeTopTabs('match')"
          :class="[
            top_tab_id === 'match'
              ? 'bg-[#0d406a] font-medium'
              : 'bg-white text-black',
          ]"
          class="mr-3 px-5 py-2 bg-[#0d406a] text-white text-center cursor-pointer rounded"
        >
          MATCH
        </div>
        <!-- <div
          @click="changeTopTabs('odds')"
          :class="[
            top_tab_id === 'odds'
              ? 'bg-[#0d406a] font-medium'
              : 'bg-white text-black',
          ]"
          class="mr-3 px-5 py-2 bg-[#0d406a] text-white text-center cursor-pointer rounded"
        >
          ODDS
        </div> -->
        <div
          @click="changeTopTabs('h2h')"
          :class="[
            top_tab_id === 'h2h'
              ? 'bg-[#0d406a] font-medium'
              : 'bg-white text-black',
          ]"
          class="mr-3 px-5 py-2 bg-[#0d406a] text-white text-center cursor-pointer rounded"
        >
          H2H
        </div>
        <div
          @click="changeTopTabs('standings')"
          :class="[
            top_tab_id === 'standings'
              ? 'bg-[#0d406a] font-medium'
              : 'bg-white text-black',
          ]"
          class="mr-3 px-5 py-2 bg-[#0d406a] text-white text-center cursor-pointer rounded"
        >
          Standings
        </div>
        <div
          @click="changeTopTabs('video')"
          :class="[
            top_tab_id === 'video'
              ? 'bg-[#0d406a] font-medium'
              : 'bg-white text-black',
          ]"
          class="mr-3 px-5 py-2 bg-[#0d406a] text-white text-center cursor-pointer rounded"
        >
          VIdeo
        </div>
      </div>
    </div>

    <div v-if="top_tab_id === 'match'">
      <div v-if="fixture.data">
        <FixtureDetail :fixture="fixture.data.data" />
      </div>
    </div>

    <div v-if="top_tab_id === 'h2h'">
      <div v-if="matches.data">
        <HeadToHead :allMatches="matches.data.data" />
      </div>
    </div>
    <div v-if="top_tab_id === 'standings'">
      <!-- <div class="py-5 bg-rose-700 text-white">
        This is testing for api call on load
      </div> -->
      <div class="text-center mt-5">
        team standings will display here
        <!-- <HeadToHead /> -->
      </div>
    </div>
    <div v-if="top_tab_id === 'video'">
      <div v-if="fixture.data">
        <Highlights :videos="fixture.data.data.highlights.data" />
      </div>
    </div>

    <div class="mt-5 bg-green-500 py-5 text-center text-white text-2xl mb-10">
      <h1>Player Streaks</h1>
    </div>
    <div v-if="fixture.data">
      <PlayerStreaks
        :localTeam="fixture.data.data.localTeam.data"
        :visitorTeam="fixture.data.data.visitorTeam.data"
      />
    </div>

    <!-- <p>
      {{ fixture.data.data.localTeam.data }}
    </p>

    <p>
      {{ fixture.data.data.visitorTeam.data }}
    </p> -->
  </div>
</template>

<style scoped>
* {
  font-family: Arial, sans-serif;
}

/* progress::-moz-progress-bar {
 
} */

/* .football-field {
  background-image: url(@assets/football-field.png);
  background-repeat: no-repeat;
  background-position: center;
} */
</style>
<!-- <div class="p-5 bg-rose-400">test section</div>
    {{ localTeamFormation }}
    {{ visitorTeamFormation }}

    <div v-for="local in localTeamFormation" class="relative">
      <div v-for="l in parseInt(local)" class="inline-grid grid-cols-4">
        <div class="bg-red-400 px-3">{{ l }}</div>
      </div>
    </div>

    <div class="py-5 bg-green-500"></div>
    <div v-for="local in visitorTeamFormation">
      <div v-for="l in parseInt(local)" class="inline-grid">
        <div>{{ l }}</div>
      </div>
    </div> -->
<!-- <div class="flex">
        <div class="w-full bg-gray-400">
          <div
            :style="{ width: localTeamStats.possessiontime }"
            :class="
              localTeamStats.possessiontime > visitorTeamStats.possessiontime
                ? 'bg-rose-400'
                : ''
            "
          >
            1
          </div>
        </div>
        <div class="w-full bg-gray-400">
          <div
            :style="{ width: visitorTeamStats.possessiontime }"
            :class="
              visitorTeamStats.possessiontime > localTeamStats.possessiontime
                ? 'bg-rose-400'
                : ''
            "
          >
            2
          </div>
        </div>
      </div> -->
<!-- <div class="w-full bg-gray-400">
        <div
          :style="{ width: localTeamStats.possessiontime }"
          :class="
            localTeamStats.possessiontime > visitorTeamStats.possessiontime
              ? 'bg-rose-400'
              : ''
          "
        >
          jjhfhfjfj
        </div>
      </div> -->

<!-- <div class="football-field">
        <div class="flex justify-evenly mb-4">
          <div class="bg-yellow-400 w-5">jjf</div>
        </div>
        <div class="flex justify-evenly mb-4">
          <div class=" w-5">jjf</div>
          <div class="w-5">jjf</div>
          <div class="bg-yellow-400 w-5">jjf</div>
          <div class="bg-blue-400 w-5">jjf</div>
        </div>
        <div class="flex justify-evenly mb-4">
          <div class="w-5">jjf</div>
          <div class="bg-blue-400 w-5">jjf</div>
          <div class="bg-yellow-400 w-5">jjf</div>
        </div>
        <div class="flex justify-evenly mb-4">
          <div class="bg-yellow-400 w-5">jjf</div>
        </div>
        <div class="flex justify-evenly mb-4">
          <div class="bg-blue-400 w-5">jjf</div>
          <div class="bg-yellow-400 w-5">jjf</div>
        </div>
      </div> -->
