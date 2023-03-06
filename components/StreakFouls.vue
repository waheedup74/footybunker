<script setup>
const props = defineProps({
  localteam: Object,
  visitorteam: Object,
  localTeamData: Object,
  visitorTeamData: Object,
});
const localTeam = ref([]);
const visitorTeam = ref([]);

const foulStreakLT = ref([]);
const foulStreakVT = ref([]);

const playerFoulStreakLT = ref([]);
const playerFoulStreakVT = ref([]);

onMounted(() => {
  if (props.localTeamData.data) {
    localTeam.value = props.localTeamData.data.data.slice(0, 3);
  }
  if (props.visitorTeamData.data) {
    visitorTeam.value = props.visitorTeamData.data.data.slice(0, 3);
  }

  calculateFouls(localTeam.value, "l");
  calculateFouls(visitorTeam.value, "v");
});

const calculateFouls = function (team, type) {
  const ltLineup = [];
  const ltBench = [];
  const vtLineup = [];
  const vtBench = [];
  if (type === "l") {
    for (const match of team) {
      for (const player of match.lineup.data) {
        if (
          player.stats.fouls.committed > 1 &&
          player.team_id === props.localteam.id
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
          player.stats.fouls.committed > 1 &&
          player.team_id === props.localteam.id
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
    foulStreakLT.value = [...ltLineup, ...ltBench];
    const hash = [];
    const result = foulStreakLT.value.filter(
      (v) => (hash[v.pid] = (hash[v.pid] || 0) + 1) === 3
    );
    playerFoulStreakLT.value = result;
  }
  if (type === "v") {
    for (const match of team) {
      for (const player of match.lineup.data) {
        if (
          player.stats.fouls.committed > 3 &&
          player.team_id === props.visitorteam.id
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
          player.stats.fouls.committed > 3 &&
          player.team_id === props.visitorteam.id
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
    foulStreakVT.value = [...vtLineup, ...vtBench];
    const hash = [];
    const result = foulStreakVT.value.filter(
      (v) => (hash[v.pid] = (hash[v.pid] || 0) + 1) === 3
    );
    // console.log(result);
    playerFoulStreakVT.value = result;
  }
};
</script>
<template>
  <div v-if="playerFoulStreakVT.length > 0">
    <div v-for="p in playerFoulStreakVT" class="mb-5 bg-rose-200">
      <p>
        <strong> {{ p.pn }} </strong> has made <strong>1+ fouls</strong> in last
        3 <strong> {{ props.visitorteam.name }}</strong> matches.
      </p>
    </div>
  </div>
  <div v-else>
    There is no foul streaks {{ props.visitorteam.name }} team players.
  </div>

  <div v-if="playerFoulStreakLT.length > 0">
    <div v-for="p in playerFoulStreakLT" class="mb-5 bg-rose-200">
      <p>
        <strong> {{ p.pn }} </strong> has made <strong>1+ fouls</strong> in last
        3 <strong>{{ props.localteam.name }}</strong> matches.
      </p>
    </div>
  </div>
  <div v-else>
    There is no foul streaks {{ props.localteam.name }} team players.
  </div>
</template>
<style scoped></style>
