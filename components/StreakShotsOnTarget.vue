<script setup>
const props = defineProps({
  localteam: Object,
  visitorteam: Object,
  localTeamData: Object,
  visitorTeamData: Object,
});
const localTeam = ref([]);
const visitorTeam = ref([]);

const shotsOnTargetStreakLT = ref([]);
const shotsOnTargetStreakVT = ref([]);

const playerShotsOnTargetStreakLT = ref([]);
const playerShotsOnTargetStreakVT = ref([]);

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
  // shots on target original value is "> 1"
  if (type === "l") {
    for (const match of team) {
      for (const player of match.lineup.data) {
        if (
          player.stats.shots.shots_on_goal > 1 &&
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
          player.stats.shots.shots_on_goal > 1 &&
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
    shotsOnTargetStreakLT.value = [...ltLineup, ...ltBench];
    const hash = [];
    const result = shotsOnTargetStreakLT.value.filter(
      (v) => (hash[v.pid] = (hash[v.pid] || 0) + 1) === 3
    );
    playerShotsOnTargetStreakLT.value = result;
  }
  if (type === "v") {
    for (const match of team) {
      for (const player of match.lineup.data) {
        if (
          player.stats.shots.shots_on_goal > 1 &&
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
          player.stats.shots.shots_on_goal > 1 &&
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
    shotsOnTargetStreakVT.value = [...vtLineup, ...vtBench];
    const hash = [];
    const result = shotsOnTargetStreakVT.value.filter(
      (v) => (hash[v.pid] = (hash[v.pid] || 0) + 1) === 3
    );
    // console.log(result);
    playerShotsOnTargetStreakVT.value = result;
  }
};
</script>
<template>
  <section
    v-if="
      playerShotsOnTargetStreakLT.length > 0 ||
      playerShotsOnTargetStreakVT.length > 0
    "
    class="my-5"
  >
    <h2 class="bg-rose-300 text-center py-4 text-2xl">
      Shots on Target Streaks
    </h2>
    <div v-if="playerShotsOnTargetStreakLT.length > 0">
      <div
        v-for="p in playerShotsOnTargetStreakLT"
        class="my-2 border-b border-black"
      >
        <div class="flex">
          <img :src="p.pic" class="self-center h-6 w-6 mr-3" alt="player" />
          <p>
            <strong> {{ p.pn }} </strong> has made
            <strong>1+ shots on target</strong> in last 3
            <strong>{{ props.localteam.name }}</strong> matches.
          </p>
        </div>
      </div>
    </div>
    <div v-else>
      There is no shot on target streaks {{ props.localteam.name }} team
      players.
    </div>

    <div v-if="playerShotsOnTargetStreakVT.length > 0">
      <div
        v-for="p in playerShotsOnTargetStreakVT"
        class="my-2 border-b border-black"
      >
        <div class="flex">
          <img :src="p.pic" class="self-center h-6 w-6 mr-3" alt="player" />
          <p>
            <strong> {{ p.pn }} </strong> has made
            <strong>1+ shots on target</strong> in last 3
            <strong> {{ props.visitorteam.name }}</strong> matches.
          </p>
        </div>
      </div>
    </div>
    <div v-else>
      There is no shots on target streaks {{ props.visitorteam.name }} team
      players.
    </div>
  </section>
</template>
<style scoped></style>
