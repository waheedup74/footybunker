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

const ltTotalYellowCards = ref(0);
const vtTotalYellowCards = ref(0);

const ltTotalThrowIn = ref(0);
const vtTotalThrowIn = ref(0);

const ltToatlFreeKicks = ref(0);
const vtToatlFreeKicks = ref(0);

const ltTotalGoalKicks = ref(0);
const vtTotalGoalKicks = ref(0);

const ltTotalCorners = ref(0);
const vtTotalCorners = ref(0);

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

  let ltYellowCards = 0;
  let vtYellowCards = 0;

  let ltThrowIn = 0;
  let vtThrowIn = 0;

  let ltFreeKicks = 0;
  let vtFreeKicks = 0;

  let ltGoalKicks = 0;
  let vtGoalKicks = 0;

  let ltCorners = 0;
  let vtCorners = 0;

  if (type === "l") {
    for (const match of team) {
      for (const m of match.stats.data) {
        if (m.team_id === props.localteam.id) {
          ltTackles += m.tackles;
          ltOffsides += m.offsides;
          ltShots += m.shots.total;
          ltYellowCards += m.yellowredcards;
          ltThrowIn += m.throw_in;
          ltFreeKicks += m.free_kick;
          ltGoalKicks += m.goal_kick;
          ltCorners += m.corners;
        }
      }
    }
    ltTotalTackle.value = ltTackles;
    ltTotalOffsides.value = ltOffsides;
    ltTotalShots.value = ltShots;
    ltTotalYellowCards.value = ltYellowCards;
    ltTotalThrowIn.value = ltThrowIn;
    ltToatlFreeKicks.value = ltFreeKicks;
    ltTotalGoalKicks.value = ltGoalKicks;
    ltTotalCorners.value = ltCorners;
  }
  if (type === "v") {
    for (const match of team) {
      for (const m of match.stats.data) {
        if (m.team_id === props.visitorteam.id) {
          vtTackles += m.tackles;
          vtOffsides += m.offsides;
          vtShots += m.shots.total;
          vtYellowCards += m.yellowredcards;
          vtThrowIn += m.throw_in;
          vtFreeKicks += m.free_kick;
          vtGoalKicks += m.goal_kick;
          vtCorners += m.corners;
        }
      }
    }
    vtTotalTackle.value = vtTackles;
    vtTotalOffsides.value = vtOffsides;
    vtTotalShots.value = vtShots;
    vtTotalYellowCards.value = vtYellowCards;
    vtTotalThrowIn.value = vtThrowIn;
    vtToatlFreeKicks.value = vtFreeKicks;
    vtTotalGoalKicks.value = vtGoalKicks;
    vtTotalCorners.value = vtCorners;
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

  <h2 class="bg-rose-300 text-center py-4 text-2xl">
    Team Yellow Card Streaks
  </h2>
  <div class="my-4">
    <div class="my-2 border-b border-black" v-if="ltTotalYellowCards > 1">
      <div class="flex">
        <img
          :src="props.localteam.logo_path"
          class="self-center h-6 w-6 mr-3"
          alt="player"
        />
        <p>
          <strong>{{ props.localteam.name }}</strong> has got
          <strong> 1+</strong> yellow cards in last 3 games.
        </p>
      </div>
    </div>
    <div class="my-2 border-b border-black" v-else>
      There is no <strong>1+</strong> yellow cards streak of
      {{ props.localteam.name }}
    </div>
    <div class="my-2 border-b border-black" v-if="vtTotalYellowCards > 1">
      <div class="flex">
        <img
          :src="props.visitorteam.logo_path"
          class="self-center h-6 w-6 mr-3"
          alt="player"
        />
        <p>
          <strong>{{ props.visitorteam.name }}</strong> has got
          <strong> 1+</strong> yellow cards in last 3 games.
        </p>
      </div>
    </div>
    <div class="my-2 border-b border-black" v-else>
      There is no <strong>1+</strong> yellow cards streak of
      {{ props.visitorteam.name }}
    </div>
  </div>

  <h2 class="bg-rose-300 text-center py-4 text-2xl">Team Throw_in Streaks</h2>
  <div class="my-4">
    <div class="my-2 border-b border-black" v-if="ltTotalThrowIn > 15">
      <div class="flex">
        <img
          :src="props.localteam.logo_path"
          class="self-center h-6 w-6 mr-3"
          alt="player"
        />
        <p>
          <strong>{{ props.localteam.name }}</strong> has made
          <strong> 15+</strong> throw_in in last 3 games.
        </p>
      </div>
    </div>
    <div class="my-2 border-b border-black" v-else>
      There is no <strong>15+</strong> throw_in streak of
      {{ props.localteam.name }}
    </div>
    <div class="my-2 border-b border-black" v-if="vtTotalThrowIn > 15">
      <div class="flex">
        <img
          :src="props.visitorteam.logo_path"
          class="self-center h-6 w-6 mr-3"
          alt="player"
        />
        <p>
          <strong>{{ props.visitorteam.name }}</strong> has made
          <strong> 15+</strong> throw_in in last 3 games.
        </p>
      </div>
    </div>
    <div class="my-2 border-b border-black" v-else>
      There is no <strong>15+</strong> throw_in streak of
      {{ props.visitorteam.name }}
    </div>
  </div>

  <h2 class="bg-rose-300 text-center py-4 text-2xl">Team Free Kicks Streaks</h2>
  <div class="my-4">
    <div class="my-2 border-b border-black" v-if="ltToatlFreeKicks > 10">
      <div class="flex">
        <img
          :src="props.localteam.logo_path"
          class="self-center h-6 w-6 mr-3"
          alt="player"
        />
        <p>
          <strong>{{ props.localteam.name }}</strong> has made
          <strong> 10+</strong> free kicks in last 3 games.
        </p>
      </div>
    </div>
    <div class="my-2 border-b border-black" v-else>
      There is no <strong>10+</strong> free kicks streak of
      {{ props.localteam.name }}
    </div>
    <div class="my-2 border-b border-black" v-if="vtToatlFreeKicks > 10">
      <div class="flex">
        <img
          :src="props.visitorteam.logo_path"
          class="self-center h-6 w-6 mr-3"
          alt="player"
        />
        <p>
          <strong>{{ props.visitorteam.name }}</strong> has made
          <strong> 10+</strong> free kicks in last 3 games.
        </p>
      </div>
    </div>
    <div class="my-2 border-b border-black" v-else>
      There is no <strong>10+</strong> free kicks streak of
      {{ props.visitorteam.name }}
    </div>
  </div>

  <h2 class="bg-rose-300 text-center py-4 text-2xl">Team Goal Kicks Streaks</h2>
  <div class="my-4">
    <div class="my-2 border-b border-black" v-if="ltTotalGoalKicks > 3">
      <div class="flex">
        <img
          :src="props.localteam.logo_path"
          class="self-center h-6 w-6 mr-3"
          alt="player"
        />
        <p>
          <strong>{{ props.localteam.name }}</strong> has made
          <strong> 3+</strong> goal kicks in last 3 games.
        </p>
      </div>
    </div>
    <div class="my-2 border-b border-black" v-else>
      There is no <strong>3+</strong> goal kicks streak of
      {{ props.localteam.name }}
    </div>
    <div class="my-2 border-b border-black" v-if="vtTotalGoalKicks > 15">
      <div class="flex">
        <img
          :src="props.visitorteam.logo_path"
          class="self-center h-6 w-6 mr-3"
          alt="player"
        />
        <p>
          <strong>{{ props.visitorteam.name }}</strong> has made
          <strong> 3+</strong> goal kicks in last 3 games.
        </p>
      </div>
    </div>
    <div class="my-2 border-b border-black" v-else>
      There is no <strong>3+</strong> goal kicks streak of
      {{ props.visitorteam.name }}
    </div>
  </div>

  <h2 class="bg-rose-300 text-center py-4 text-2xl">Team Goal Kicks Streaks</h2>
  <div class="my-4">
    <div class="my-2 border-b border-black" v-if="ltTotalCorners > 3">
      <div class="flex">
        <img
          :src="props.localteam.logo_path"
          class="self-center h-6 w-6 mr-3"
          alt="player"
        />
        <p>
          <strong>{{ props.localteam.name }}</strong> has made
          <strong> 3+</strong> corners in last 3 games.
        </p>
      </div>
    </div>
    <div class="my-2 border-b border-black" v-else>
      There is no <strong>3+</strong> corners streak of
      {{ props.localteam.name }}
    </div>
    <div class="my-2 border-b border-black" v-if="vtTotalCorners > 15">
      <div class="flex">
        <img
          :src="props.visitorteam.logo_path"
          class="self-center h-6 w-6 mr-3"
          alt="player"
        />
        <p>
          <strong>{{ props.visitorteam.name }}</strong> has made
          <strong> 3+</strong> corners in last 3 games.
        </p>
      </div>
    </div>
    <div class="my-2 border-b border-black" v-else>
      There is no <strong>3+</strong> corners streak of
      {{ props.visitorteam.name }}
    </div>
  </div>
</template>
<style scoped></style>
