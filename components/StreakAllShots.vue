<script setup>
const props = defineProps({
  localteam: Object,
  visitorteam: Object,
  localTeamData: Object,
  visitorTeamData: Object,
});
const localTeam = ref([]);
const visitorTeam = ref([]);

const totalShotsStreakLT = ref([]);
const totalShotsStreakVT = ref([]);

const playerTotalShotsStreakLT = ref([]);
const playerTotalShotsStreakVT = ref([]);

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
          player.stats.shots.shots_total > 2 &&
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
          player.stats.shots.shots_total > 2 &&
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
    totalShotsStreakLT.value = [...ltLineup, ...ltBench];
    const hash = [];
    const result = totalShotsStreakLT.value.filter(
      (v) => (hash[v.pid] = (hash[v.pid] || 0) + 1) === 3
    );
    playerTotalShotsStreakLT.value = result;
  }
  if (type === "v") {
    for (const match of team) {
      for (const player of match.lineup.data) {
        if (
          player.stats.shots.shots_total > 2 &&
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
          player.stats.shots.shots_total > 2 &&
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
    totalShotsStreakVT.value = [...vtLineup, ...vtBench];
    const hash = [];
    const result = totalShotsStreakVT.value.filter(
      (v) => (hash[v.pid] = (hash[v.pid] || 0) + 1) === 3
    );
    // console.log(result);
    playerTotalShotsStreakVT.value = result;
  }
};
</script>
<template>
  <div v-if="playerTotalShotsStreakLT.length > 0">
    <div
      v-for="p in playerTotalShotsStreakLT"
      class="my-2 border border-b-black"
    >
      <div class="flex">
        <img :src="p.pic" class="self-center h-6 w-6 mr-3" alt="player" />
        <p>
          <strong> {{ p.pn }} </strong> has made <strong>2+ shots</strong> in
          last 3 <strong>{{ props.localteam.name }}</strong> matches.
        </p>
      </div>
    </div>
  </div>
  <div v-else>
    There is no shots streaks {{ props.localteam.name }} team players.
  </div>
  <div v-if="playerTotalShotsStreakVT.length > 0">
    <div
      v-for="p in playerTotalShotsStreakVT"
      class="my-2 border border-b-black"
    >
      <div class="flex">
        <img :src="p.pic" class="self-center h-6 w-6 mr-3" alt="player" />
        <p>
          <strong> {{ p.pn }} </strong> has made <strong>2+ shots</strong> in
          last 3 <strong> {{ props.visitorteam.name }}</strong> matches.
        </p>
      </div>
    </div>
  </div>
  <div v-else>
    There is no shots streaks {{ props.visitorteam.name }} team players.
  </div>
</template>
<style scoped></style>
