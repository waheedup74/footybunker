<script setup>
const route = useRoute();
const matches = ref({});
const fixture = ref({});
const commentary = ref({});

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
  let fixtureId = route.params.fixture;
  if (isNaN(route.params.fixture)) {
    let split = fixtureId.split("-");
    fixtureId = split[split.length - 1];
  }
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

const teamStats = (teamName, team_id) => {
  navigateTo(`${teamName}-stats-${team_id}`);
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
        @click="
          teamStats(
            fixture.data.data.localTeam.data.name,
            fixture.data.data.localteam_id
          )
        "
      >
        <img
          :src="fixture.data.data.localTeam.data.logo_path"
          class="w-16 md:w-32 border p-3 mx-auto rounded"
          alt="logo"
        />

        <p class="mt-3 font-semibold">
          {{ fixture.data.data.localTeam.data.name }}
        </p>
      </div>
      <div class="text-center font-medium self-center">
        <div>
          {{ fixture.data.data.time.starting_at.date_time.slice(0, 16) }}
        </div>
        <div class="text-4xl md:text-6xl lining-nums">
          {{ fixture.data.data.scores.localteam_score }} -
          {{ fixture.data.data.scores.visitorteam_score }}
        </div>
      </div>
      <div
        class="text-center self-center cursor-pointer"
        @click="
          teamStats(
            fixture.data.data.visitorTeam.data.name,
            fixture.data.data.visitorteam_id
          )
        "
      >
        <img
          :src="fixture.data.data.visitorTeam.data.logo_path"
          class="w-16 md:w-32 border p-3 mx-auto rounded"
          alt="logo"
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
  </div>
</template>

<style scoped>
/* progress::-moz-progress-bar {
 
} */

/* .football-field {
  background-image: url(@assets/football-field.png);
  background-repeat: no-repeat;
  background-position: center;
} */
</style>
