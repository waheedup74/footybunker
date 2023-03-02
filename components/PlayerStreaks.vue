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

const tackleStreakLT = ref([]);
const tackleStreakVT = ref([]);

onMounted(async () => {
  localTeamStats.value = await useFetch(
    () =>
      `https://soccer.sportmonks.com/api/v2.0/fixtures/between/2023-02-1/2023-03-3/${props.localTeam.id}?api_token=yJa5UcHQ0V22MXG9wlpQ3vtf8ucr6GzJJdd0IShA2j5wOSatggY783JolO6J`
  );

  if (localTeamStats.value.data) {
    for (const match of localTeamStats.value.data.data) {
      localTeamFixturesidList.value.push(match.id);
    }

    // localTeamFixturesidList.value = localTeamFixturesidList.value.reverse();
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

    // visitorTeamFixturesidList.value = visitorTeamFixturesidList.value.reverse();
    visitorTeamFixturesidListString.value = String(
      visitorTeamFixturesidList.value
    );
  }

  localTeamFixtures.value = await useFetch(
    () =>
      `https://soccer.sportmonks.com/api/v2.0/fixtures/multi/${localTeamFixturesidListString.value}?api_token=yJa5UcHQ0V22MXG9wlpQ3vtf8ucr6GzJJdd0IShA2j5wOSatggY783JolO6J&include=localTeam,visitorTeam,,lineup.player`
  );

  visitorTeamFixtures.value = await useFetch(
    () =>
      `https://soccer.sportmonks.com/api/v2.0/fixtures/multi/${visitorTeamFixturesidListString.value}?api_token=yJa5UcHQ0V22MXG9wlpQ3vtf8ucr6GzJJdd0IShA2j5wOSatggY783JolO6J&include=localTeam,visitorTeam,lineup.player`
  );
  // homes.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
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
  let idsLT = [];
  for (const p of test.lineup.data) {
    if (p.team_id === props.localTeam.id) {
      idsLT.push(p.player_id);
    }
  }
  let idsVT = [];
  for (const p of test.lineup.data) {
    if (p.team_id === props.visitorTeam.id) {
      idsVT.push(p.player_id);
    }
  }
  console.log("ids VT", idsVT);
  console.log("ids LT", idsLT);
  calculatePasses(localTeamFixtures.value.data.data.slice(0, 3), "l");
  calculatePasses(visitorTeamFixtures.value.data.data.slice(0, 3), "v");
});

const calculatePasses = function (team, type) {
  console.log("sorted and sliced", team);
  if (type === "l") {
    for (const match of team) {
      for (const player of match.lineup.data) {
        if (
          player.stats.passing.passes > 70 &&
          player.team_id === props.localTeam.id
        ) {
          passesStreakLT.value.push({
            tid: player.team_id,
            pid: player.player_id,
            pn: player.player_name,
            date: match.time.starting_at.date,
          });
        }
      }
    }
  }
  // hasIdOccurredThreeTimes(passesStreakLT.value);
  if (type === "v") {
    for (const match of team) {
      for (const player of match.lineup.data) {
        if (
          player.stats.passing.passes > 70 &&
          player.team_id === props.visitorTeam.id
        ) {
          passesStreakVT.value.push({
            tid: player.team_id,
            pid: player.player_id,
            pn: player.player_name,
            date: match.time.starting_at.date,
          });
        }
      }
    }
  }
};

function hasIdOccurredThreeTimes(ids, dataArray) {
  let idCounts = {};
  for (let id of dataArray) {
    if (id in idCounts) {
      idCounts[id]++;
    } else {
      idCounts[id] = 1;
    }
  }
  for (let id of ids) {
    if (idCounts[id] >= 3) {
      return true;
    }
  }
  return false;
}
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

  <div v-if="passesStreakLT.length > 0">
    <div v-for="p in passesStreakLT" class="mb-5 bg-rose-200">
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
    There is no passes streaks {{ props.localTeam.name }} team players.
  </div>
  <div v-if="passesStreakVT.length > 0">
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
  </div>
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
