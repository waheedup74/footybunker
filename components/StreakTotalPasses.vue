<script setup>
const props = defineProps({
  localteam: Object,
  visitorteam: Object,
  localTeamData: Object,
  visitorTeamData: Object,
});
const localTeam = ref([]);
const visitorTeam = ref([]);

const ltTotalTackle = ref(0);
const vtTotalTackle = ref(0);

const ltTotalOffsides = ref(0);
const vtTotalOffsides = ref(0);

const ltTotalShots = ref(0);
const vtTotalShots = ref(0);

onMounted(() => {
  if (props.localTeamData.data) {
    localTeam.value = props.localTeamData.data.data.slice(0, 3);
  }
  if (props.visitorTeamData.data) {
    visitorTeam.value = props.visitorTeamData.data.data.slice(0, 3);
  }

  calculateStreaks(localTeam.value, "l");
  calculateStreaks(visitorTeam.value, "v");
});

const calculateStreaks = function (team, type) {
  let ltTackles = 0;
  let vtTackles = 0;

  let ltOffsides = 0;
  let vtOffsides = 0;

  let ltShots = 0;
  let vtShots = 0;

  if (type === "l") {
    for (const match of team) {
      for (const m of match.stats.data) {
        if (m.team_id === props.localteam.id) {
          ltTackles += m.tackles;
          ltOffsides += m.offsides;
          ltShots += m.shots.total;
        }
      }
    }
    ltTotalTackle.value = ltTackles;
    ltTotalOffsides.value = ltOffsides;
    ltTotalShots.value = ltShots;
  }
  if (type === "v") {
    for (const match of team) {
      for (const m of match.stats.data) {
        if (m.team_id === props.visitorteam.id) {
          vtTackles += m.tackles;
          vtOffsides += m.offsides;
          vtShots += m.shots.total;
        }
      }
    }
    vtTotalTackle.value = vtTackles;
    vtTotalOffsides.value = vtOffsides;
    vtTotalShots.value = vtShots;
  }
};
</script>
<template>
  <h2 class="bg-rose-300 text-center py-4 text-2xl">Team Tackle Streaks</h2>
  <div class="my-4">
    <div class="my-2 border-b border-black" v-if="ltTotalTackle > 14">
      <div class="flex">
        <img
          :src="props.localteam.logo_path"
          class="self-center h-6 w-6 mr-3"
          alt="player"
        />
        <p>
          <strong>{{ props.localteam.name }}</strong> has made
          <strong> 14+</strong> tackles in last 3 games.
        </p>
      </div>
    </div>
    <div class="my-2 border-b border-black" v-else>
      There is no <strong>14</strong> tackle streak of
      {{ props.localteam.name }}
    </div>
    <div class="my-2 border-b border-black" v-if="ltTotalTackle > 14">
      <div class="flex">
        <img
          :src="props.visitorteam.logo_path"
          class="self-center h-6 w-6 mr-3"
          alt="player"
        />
        <p>
          <strong>{{ props.visitorteam.name }}</strong> has made
          <strong> 14+</strong> tackles in last 3 games.
        </p>
      </div>
    </div>
    <div class="my-2 border-b border-black" v-else>
      There is no <strong>14</strong> tackle streak of
      {{ props.visitorteam.name }}
    </div>
  </div>

  <h2 class="bg-rose-300 text-center py-4 text-2xl">Team Offsides Streaks</h2>
  <div class="my-4">
    <div class="my-2 border-b border-black" v-if="ltTotalOffsides > 3">
      <div class="flex">
        <img
          :src="props.localteam.logo_path"
          class="self-center h-6 w-6 mr-3"
          alt="player"
        />

        <p>
          <strong>{{ props.localteam.name }}</strong> has made
          <strong> 3+</strong> offsides in last 3 games.
        </p>
      </div>
    </div>
    <div class="my-2 border-b border-black" v-else>
      There is no <strong>3+</strong> offsides streak of
      {{ props.localteam.name }}
    </div>
    <div class="my-2 border-b border-black" v-if="vtTotalOffsides > 3">
      <div class="flex">
        <img
          :src="props.visitorteam.logo_path"
          class="self-center h-6 w-6 mr-3"
          alt="player"
        />
        <p>
          <strong>{{ props.visitorteam.name }}</strong> has made
          <strong> 3+</strong> offsides in last 3 games.
        </p>
      </div>
    </div>
    <div class="my-2 border-b border-black" v-else>
      There is no <strong>3+</strong> offsides streak of
      {{ props.visitorteam.name }}
    </div>
  </div>

  <h2 class="bg-rose-300 text-center py-4 text-2xl">Team Shots Streaks</h2>
  <div class="my-4">
    <div class="my-2 border-b border-black" v-if="ltTotalShots > 24">
      <div class="flex">
        <img
          :src="props.localteam.logo_path"
          class="self-center h-6 w-6 mr-3"
          alt="player"
        />
        <p>
          <strong>{{ props.localteam.name }}</strong> has made
          <strong> 24+</strong> shots in last 3 games.
        </p>
      </div>
    </div>
    <div class="my-2 border-b border-black" v-else>
      There is no <strong>3+</strong> offsides streak of
      {{ props.localteam.name }}
    </div>
    <div class="my-2 border-b border-black" v-if="vtTotalShots > 24">
      <div class="flex">
        <img
          :src="props.visitorteam.logo_path"
          class="self-center h-6 w-6 mr-3"
          alt="player"
        />
        <p>
          <strong>{{ props.visitorteam.name }}</strong> has made
          <strong> 24+</strong> shots in last 3 games.
        </p>
      </div>
    </div>
    <div class="my-2 border-b border-black" v-else>
      There is no <strong>24+</strong> shots streak of
      {{ props.visitorteam.name }}
    </div>
  </div>
</template>
<style scoped></style>
