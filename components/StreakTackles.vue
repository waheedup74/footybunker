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

// tackles original value is "> 2"
const calculateTackles = function (team, type) {
  const ltLineup = [];
  const ltBench = [];
  const vtLineup = [];
  const vtBench = [];
  if (type === "l") {
    for (const match of team) {
      for (const player of match.lineup.data) {
        if (
          player.stats.other.tackles >= 1 &&
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
          player.stats.other.tackles >= 1 &&
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
          player.stats.other.tackles >= 1 &&
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
          player.stats.other.tackles >= 1 &&
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
    tacklesStreakVT.value = [...vtLineup, ...vtBench];
    const hash = [];
    const result = tacklesStreakVT.value.filter(
      (v) => (hash[v.pid] = (hash[v.pid] || 0) + 1) === 3
    );
    playerTacklesStreakVT.value = result;
  }
};
</script>
<template>
  <div
    v-if="playerTacklesStreakLT.length > 0 || playerTacklesStreakVT.length > 0"
  >
    <section class="my-5">
      <h2 class="bg-rose-300 text-center py-4 text-2xl">Tackles Streaks</h2>
      <div v-if="playerTacklesStreakLT.length > 0">
        <div
          v-for="p in playerTacklesStreakLT"
          class="my-2 border-b border-black"
        >
          <div class="flex">
            <img :src="p.pic" class="self-center h-6 w-6 mr-3" alt="player" />
            <p>
              <strong> {{ p.pn }} </strong> has made
              <strong>1 or more than 1 tackles</strong> in last 3
              <strong>{{ props.localteam.name }}</strong> matches.
            </p>
          </div>
        </div>
      </div>
      <div v-else>
        There is no tackle streaks {{ props.visitorteam.name }} team players.
      </div>
      <div v-if="playerTacklesStreakVT.length > 0">
        <div
          v-for="p in playerTacklesStreakVT"
          class="my-2 border-b border-black"
        >
          <div class="flex">
            <img :src="p.pic" class="self-center h-6 w-6 mr-3" alt="player" />
            <p>
              <strong> {{ p.pn }} </strong> has made
              <strong>1 or more than 1 tackles</strong> in last 3
              <strong> {{ props.visitorteam.name }}</strong> matches.
            </p>
          </div>
        </div>
      </div>
      <div v-else>
        There is no tackle streaks {{ props.localteam.name }} team players.
      </div>
    </section>
  </div>
</template>
<style scoped></style>
