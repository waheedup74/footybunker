<script setup>
const props = defineProps({
  localteam: Object,
  visitorteam: Object,
  localTeamData: Object,
  visitorTeamData: Object,
});
const localTeam = ref([]);
const visitorTeam = ref([]);

const tacklesStreakLT = ref([]);
const tacklesStreakVT = ref([]);

const playerTacklesStreakLT = ref([]);
const playerTacklesStreakVT = ref([]);

onMounted(() => {
  if (props.localTeamData.data) {
    localTeam.value = props.localTeamData.data.data.slice(0, 3);
  }
  if (props.visitorTeamData.data) {
    visitorTeam.value = props.visitorTeamData.data.data.slice(0, 3);
  }

  calculateTackles(localTeam.value, "l");
  calculateTackles(visitorTeam.value, "v");
});

const calculateTackles = function (team, type) {
  const ltLineup = [];
  const ltBench = [];
  const vtLineup = [];
  const vtBench = [];
  if (type === "l") {
    for (const match of team) {
      for (const player of match.lineup.data) {
        if (
          player.stats.other.tacklkes > 3 &&
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
          player.stats.other.tacklkes > 3 &&
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
    tacklesStreakLT.value = [...ltLineup, ...ltBench];
    const hash = [];
    const result = tacklesStreakLT.value.filter(
      (v) => (hash[v.pid] = (hash[v.pid] || 0) + 1) === 3
    );
    playerTacklesStreakLT.value = result;
  }
  if (type === "v") {
    for (const match of team) {
      for (const player of match.lineup.data) {
        if (
          player.stats.other.tackles > 3 &&
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
          player.stats.other.tackles > 3 &&
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
    tacklesStreakVT.value = [...vtLineup, ...vtBench];
    const hash = [];
    const result = tacklesStreakVT.value.filter(
      (v) => (hash[v.pid] = (hash[v.pid] || 0) + 1) === 3
    );
    // console.log(result);
    playerTacklesStreakVT.value = result;
  }
};
</script>
<template>
  <div v-if="playerTacklesStreakVT.length > 0">
    <div v-for="p in playerTacklesStreakVT" class="mb-5 bg-rose-200">
      <p>
        <strong> {{ p.pn }} </strong> has made <strong>3+ tackles</strong> in
        last 3 <strong> {{ props.visitorteam.name }}</strong> matches.
      </p>
    </div>
  </div>
  <div v-else>
    There is no tackle streaks {{ props.localteam.name }} team players.
  </div>

  <div v-if="playerTacklesStreakLT.length > 0">
    <div v-for="p in playerTacklesStreakLT" class="mb-5 bg-rose-200">
      <p>
        <strong> {{ p.pn }} </strong> has made <strong>3+ tackles</strong> in
        last 3 <strong>{{ props.localteam.name }}</strong> matches.
      </p>
    </div>
  </div>
  <div v-else>
    There is no tackle streaks {{ props.visitorteam.name }} team players.
  </div>
</template>
<style scoped></style>
