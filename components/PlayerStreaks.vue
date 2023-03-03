<script setup>
const props = defineProps({
  localTeam: Object,
  visitorTeam: Object,
});
const localTeamStats = ref({});
const visitorTeamStats = ref({});

const localTeamFixtures = ref({});
const visitorTeamFixtures = ref({});

const localTeamFixturesidList = ref([]);
const visitorTeamFixturesidList = ref([]);

const localTeamFixturesidListString = ref("");
const visitorTeamFixturesidListString = ref("");

const passesStreakLT = ref([]);
const passesStreakVT = ref([]);

const playerPassesStreakLT = ref([]);
const playerPassesStreakVT = ref([]);

const tackleStreakLT = ref([]);
const tackleStreakVT = ref([]);

const idsLT = ref([]);
const idsVT = ref([]);

onMounted(async () => {
  localTeamStats.value = await useFetch(
    () =>
      `https://soccer.sportmonks.com/api/v2.0/fixtures/between/2023-02-1/2023-03-3/${props.localTeam.id}?api_token=yJa5UcHQ0V22MXG9wlpQ3vtf8ucr6GzJJdd0IShA2j5wOSatggY783JolO6J`
  );

  if (localTeamStats.value.data) {
    for (const match of localTeamStats.value.data.data) {
      localTeamFixturesidList.value.push(match.id);
    }
    localTeamFixturesidListString.value = String(localTeamFixturesidList.value);
  }

  visitorTeamStats.value = await useFetch(
    () =>
      `https://soccer.sportmonks.com/api/v2.0/fixtures/between/2023-02-1/2023-03-3/${props.visitorTeam.id}?api_token=yJa5UcHQ0V22MXG9wlpQ3vtf8ucr6GzJJdd0IShA2j5wOSatggY783JolO6J`
  );

  if (visitorTeamStats.value.data) {
    for (const match of visitorTeamStats.value.data.data) {
      visitorTeamFixturesidList.value.push(match.id);
    }

    visitorTeamFixturesidListString.value = String(
      visitorTeamFixturesidList.value
    );
  }

  localTeamFixtures.value = await useFetch(
    () =>
      `https://soccer.sportmonks.com/api/v2.0/fixtures/multi/${localTeamFixturesidListString.value}?api_token=yJa5UcHQ0V22MXG9wlpQ3vtf8ucr6GzJJdd0IShA2j5wOSatggY783JolO6J&include=localTeam,visitorTeam,,lineup,bench`
  );

  visitorTeamFixtures.value = await useFetch(
    () =>
      `https://soccer.sportmonks.com/api/v2.0/fixtures/multi/${visitorTeamFixturesidListString.value}?api_token=yJa5UcHQ0V22MXG9wlpQ3vtf8ucr6GzJJdd0IShA2j5wOSatggY783JolO6J&include=localTeam,visitorTeam,lineup,bench`
  );

  // calculateTackles(localTeamFixtures.value, "l");
  // calculateTackles(visitorTeamFixtures.value, "v");

  localTeamFixtures.value.data.data.sort(
    (a, b) =>
      new Date(b.time.starting_at.date) - new Date(a.time.starting_at.date)
  );
  visitorTeamFixtures.value.data.data.sort(
    (a, b) =>
      new Date(b.time.starting_at.date) - new Date(a.time.starting_at.date)
  );
  const test = visitorTeamFixtures.value.data.data[0];

  for (const p of test.lineup.data) {
    if (p.team_id === props.localTeam.id) {
      idsLT.value.push(p.player_id);
    }
  }

  for (const p of test.lineup.data) {
    if (p.team_id === props.visitorTeam.id) {
      idsVT.value.push(p.player_id);
    }
  }
  calculatePasses(localTeamFixtures.value.data.data.slice(0, 3), "l");
  calculatePasses(visitorTeamFixtures.value.data.data.slice(0, 3), "v");
});

const calculatePasses = function (team, type) {
  const ltLineup = [];
  const ltBench = [];
  const vtLineup = [];
  const vtBench = [];
  if (type === "l") {
    for (const match of team) {
      for (const player of match.lineup.data) {
        if (
          player.stats.passing.passes > 70 &&
          player.team_id === props.localTeam.id
        ) {
          ltLineup.push({
            tid: player.team_id,
            pid: player.player_id,
            pn: player.player_name,
            date: match.time.starting_at.date,
          });
        }
      }
      for (const player of match.bench.data) {
        if (
          player.stats.passing.passes > 70 &&
          player.team_id === props.localTeam.id
        ) {
          ltBench.push({
            tid: player.team_id,
            pid: player.player_id,
            pn: player.player_name,
            date: match.time.starting_at.date,
          });
        }
      }
    }
    passesStreakLT.value = [...ltLineup, ...ltBench];
    const hash = [];
    const result = passesStreakLT.value.filter(
      (v) => (hash[v.pid] = (hash[v.pid] || 0) + 1) === 3
    );
    playerPassesStreakLT.value = result;
  }
  if (type === "v") {
    for (const match of team) {
      for (const player of match.lineup.data) {
        if (
          player.stats.passing.passes > 70 &&
          player.team_id === props.visitorTeam.id
        ) {
          vtLineup.push({
            tid: player.team_id,
            pid: player.player_id,
            pn: player.player_name,
            date: match.time.starting_at.date,
          });
        }
      }
      for (const player of match.bench.data) {
        if (
          player.stats.passing.passes > 70 &&
          player.team_id === props.visitorTeam.id
        ) {
          vtBench.push({
            tid: player.team_id,
            pid: player.player_id,
            pn: player.player_name,
            date: match.time.starting_at.date,
          });
        }
      }
    }
    passesStreakVT.value = [...vtLineup, ...vtBench];
    const hash = [];
    const result = passesStreakVT.value.filter(
      (v) => (hash[v.pid] = (hash[v.pid] || 0) + 1) === 3
    );
    // console.log(result);
    playerPassesStreakVT.value = result;
  }
};
// const valWhichRepeat = (arr, count) =>
//   [...new Set(arr)].filter((x) => arr.filter((a.) => a === x).length >= count);

// console.log("ahdjkadh afhajkfhk", valWhichRepeat(passesStreakLT.value, 3));
// const calculateTackles = function (team, type) {
//   if (type === "l") {
//     for (const match of team.data.data) {
//       for (const player of match.lineup.data) {
//         if (
//           player.stats.other.tackles > 3 &&
//           player.team_id === props.localTeam.id
//         ) {
//           tackleStreakLT.value.push({
//             tid: player.team_id,
//             pid: player.player_id,
//             pn: player.player_name,
//             date: match.time.starting_at.date,
//             tackle: player.stats.other.tackles,
//           });
//         }
//       }
//     }
//   }
//   if (type === "v") {
//     for (const match of team.data.data) {
//       for (const player of match.lineup.data) {
//         if (
//           player.stats.other.tackles > 3 &&
//           player.team_id === props.visitorTeam.id
//         ) {
//           tackleStreakVT.value.push({
//             tid: player.team_id,
//             pid: player.player_id,
//             pn: player.player_name,
//             date: match.time.starting_at.date,
//             tackle: player.stats.other.tackles,
//           });
//         }
//       }
//     }
//   }
// };
</script>
<template>
  <!-- <div class="bg-green-200 text-2xl">Local team{{ props.localTeam }}</div>
  <div class="bg-purple-200 text-2xl">visitor team {{ props.visitorTeam }}</div> -->

  <!-- <div class="bg-red-900 text-white">{{ passesStreakVT }}</div> -->

  <div v-if="playerPassesStreakVT.length > 0">
    <div v-for="p in playerPassesStreakVT" class="mb-5 bg-rose-200">
      <p>
        <strong> {{ p.pn }} </strong> has made <strong>70+ passes</strong> in
        last 3 <strong> {{ props.visitorTeam.name }}</strong> matches.
      </p>
    </div>
  </div>
  <div v-else>
    There is no passes streaks {{ props.localTeam.name }} team players.
  </div>
  <!-- <div class="bg-black text-white">{{ passesStreakLT }}</div> -->

  <div v-if="playerPassesStreakLT.length > 0">
    <div v-for="p in playerPassesStreakLT" class="mb-5 bg-rose-200">
      <p>
        <strong> {{ p.pn }} </strong> has made <strong>70+ passes</strong> in
        last 3 <strong>{{ props.localTeam.name }}</strong> matches.
      </p>
    </div>
  </div>
  <div v-else>
    There is no passes streaks {{ props.visitorTeam.name }} team players.
  </div>
  <!-- <div v-if="passesStreakVT.length > 0">
    <div v-for="p in passesStreakVT" class="mb-5 bg-purple-200">
      <span class="mr-4">
        {{ p.tid }}
      </span>
      <span class="mr-4">
        {{ p.pid }}
      </span>

      <span class="mr-4">
        {{ p.pn }}
      </span>

      <span class="mr-4">
        {{ p.date }}
      </span>
      <span class="mr-4">
        {{ p.tackle }}
      </span>
    </div>
  </div>
  <div v-else>
    There is no passes streaks {{ props.visitorTeam.name }} team players.
  </div> -->
  <!-- <div v-if="visitorTeamFixtures.data" class="bg-rose-200">
    {{ props.visitorTeam.name }}
    <span v-for="match in visitorTeamFixtures.data.data">
      <span v-for="player in match?.lineup.data">
        <p v-if="player.stats.other.tackles > 3">
          <span class="mr-4"> {{ player.fixture_id }} </span>
          <span class="mr-4"> {{ player.team_id }} </span>
          <span class="mr-4"> {{ player.player_id }} </span>
          <span class="mr-4"> {{ match.time.starting_at.date }} </span>
          <span> {{ player.stats.other.tackles }} </span>
          {{ player.player_name }}
        </p>
      </span>
    </span>
  </div> -->
</template>
<style scoped></style>
