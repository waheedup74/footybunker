<script setup>
const props = defineProps({
  localteam: Object,
  visitorteam: Object,
  localTeamData: Object,
  visitorTeamData: Object,
});
const localTeam = ref([]);
const visitorTeam = ref([]);

const goalStreakLT = ref([]);
const goalStreakVT = ref([]);

const playerGoalStreakLT = ref([]);
const playerGoalStreakVT = ref([]);

onMounted(() => {
  if (props.localTeamData.data) {
    localTeam.value = props.localTeamData.data.data.slice(0, 3);
  }
  if (props.visitorTeamData.data) {
    visitorTeam.value = props.visitorTeamData.data.data.slice(0, 3);
  }

  calculateGoals(localTeam.value, "l");
  calculateGoals(visitorTeam.value, "v");
});

const calculateGoals = function (team, type) {
  const ltLineup = [];
  const ltBench = [];
  const vtLineup = [];
  const vtBench = [];
  // Goal original value is "> 1"
  if (type === "l") {
    for (const match of team) {
      for (const player of match.lineup.data) {
        if (
          player.stats.goals.scored > 1 &&
          player.team_id === props.localteam.id
        ) {
          ltLineup.push({
            tid: player.team_id,
            pid: player.player_id,
            pn: player.player_name,
            pic: player.player.data?.image_path,
            date: match.time.starting_at.date,
          });
        }
      }
      for (const player of match.bench.data) {
        if (
          player.stats.goals.scored > 1 &&
          player.team_id === props.localteam.id
        ) {
          ltBench.push({
            tid: player.team_id,
            pid: player.player_id,
            pn: player.player_name,
            pic: player.player.data?.image_path,
            date: match.time.starting_at.date,
          });
        }
      }
    }
    goalStreakLT.value = [...ltLineup, ...ltBench];
    const hash = [];
    const result = goalStreakLT.value.filter(
      (v) => (hash[v.pid] = (hash[v.pid] || 0) + 1) === 3
    );
    playerGoalStreakLT.value = result;
  }
  if (type === "v") {
    for (const match of team) {
      for (const player of match.lineup.data) {
        if (
          player.stats.goals.scored > 1 &&
          player.team_id === props.visitorteam.id
        ) {
          vtLineup.push({
            tid: player.team_id,
            pid: player.player_id,
            pn: player.player_name,
            pic: player.player.data?.image_path,
            date: match.time.starting_at.date,
          });
        }
      }
      for (const player of match.bench.data) {
        if (
          player.stats.goals.scored > 1 &&
          player.team_id === props.visitorteam.id
        ) {
          vtBench.push({
            tid: player.team_id,
            pid: player.player_id,
            pn: player.player_name,
            pic: player.player.data?.image_path,
            date: match.time.starting_at.date,
          });
        }
      }
    }
    goalStreakVT.value = [...vtLineup, ...vtBench];
    const hash = [];
    const result = goalStreakVT.value.filter(
      (v) => (hash[v.pid] = (hash[v.pid] || 0) + 1) === 3
    );
    // console.log(result);
    playerGoalStreakVT.value = result;
  }
};
</script>
<template>
  <section
    v-if="playerGoalStreakLT.length > 0 || playerGoalStreakVT.length > 0"
    class="my-5"
  >
    <h2 class="bg-rose-300 text-center py-4 text-2xl">Goal Streaks</h2>
    <div v-if="playerGoalStreakLT.length > 0">
      <div v-for="p in playerGoalStreakLT" class="my-2 border-b border-black">
        <div class="flex">
          <img :src="p.pic" class="self-center h-6 w-6 mr-3" alt="player" />
          <p>
            <strong> {{ p.pn }} </strong> has made <strong>1+ goals</strong> in
            last 3 <strong>{{ props.localteam.name }}</strong> matches.
          </p>
        </div>
      </div>
    </div>
    <div v-else>
      There is no goal streaks {{ props.visitorteam.name }} team players.
    </div>
    <div v-if="playerGoalStreakVT.length > 0">
      <div v-for="p in playerGoalStreakVT" class="my-2 border-b border-black">
        <div class="flex">
          <img :src="p.pic" class="self-center h-6 w-6 mr-3" alt="player" />
          <p>
            <strong> {{ p.pn }} </strong> has made <strong>1+ goals</strong> in
            last 3 <strong> {{ props.visitorteam.name }}</strong> matches.
          </p>
        </div>
      </div>
    </div>
    <div v-else>
      There is no goal streaks {{ props.localteam.name }} team players.
    </div>
  </section>
</template>
<style scoped></style>
