<script setup>
const props = defineProps({
  localteam: Object,
  visitorteam: Object,
  localTeamData: Object,
  visitorTeamData: Object,
});
const localTeam = ref([]);
const visitorTeam = ref([]);

const yellowCardStreakLT = ref([]);
const yellowCardStreakVT = ref([]);

const playerYellowCardStreakLT = ref([]);
const playerYellowCardStreakVT = ref([]);

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
          player.stats.cards.yellowcards > 3 &&
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
          player.stats.cards.yellowcards > 3 &&
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
    yellowCardStreakLT.value = [...ltLineup, ...ltBench];
    const hash = [];
    const result = yellowCardStreakLT.value.filter(
      (v) => (hash[v.pid] = (hash[v.pid] || 0) + 1) === 3
    );
    playerYellowCardStreakLT.value = result;
  }
  if (type === "v") {
    for (const match of team) {
      for (const player of match.lineup.data) {
        if (
          player.stats.cards.yellowcards > 1 &&
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
          player.stats.cards.yellowcards > 1 &&
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
    yellowCardStreakVT.value = [...vtLineup, ...vtBench];
    const hash = [];
    const result = yellowCardStreakVT.value.filter(
      (v) => (hash[v.pid] = (hash[v.pid] || 0) + 1) === 3
    );
    // console.log(result);
    playerYellowCardStreakVT.value = result;
  }
};
</script>
<template>
  <div v-if="playerYellowCardStreakVT.length > 0">
    <div v-for="p in playerYellowCardStreakVT" class="mb-5 bg-rose-200">
      <p>
        <strong> {{ p.pn }} </strong> has got
        <strong>1+ yellow cards</strong> in last 3
        <strong> {{ props.visitorteam.name }}</strong> matches.
      </p>
    </div>
  </div>
  <div v-else>
    There is no yellow card streak of {{ props.visitorteam.name }} team players.
  </div>

  <div v-if="playerYellowCardStreakLT.length > 0">
    <div v-for="p in playerYellowCardStreakLT" class="mb-5 bg-rose-200">
      <p>
        <strong> {{ p.pn }} </strong> has got
        <strong>1+ yellow cards</strong> in last 3
        <strong>{{ props.localteam.name }}</strong> matches.
      </p>
    </div>
  </div>
  <div v-else>
    There is no yellow card streak of {{ props.localteam.name }} team players.
  </div>
</template>
<style scoped></style>
