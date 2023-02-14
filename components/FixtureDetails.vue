<script setup>
const route = useRoute();
const fixtureId = parseInt(route.params.fixture);
const tab_id = ref("A");
const top_tab_id = ref("match");
const localTeamFormation = ref({});
const visitorTeamFormation = ref({});
const localTeamStats = ref({});
const visitorTeamStats = ref({});
// ${route.params.fixture}
// GET Team fixture stats using and Team Id and range of dates
const { data: fixDetail, error: fixturesError } = useFetch(
  () =>
    `https://soccer.sportmonks.com/api/v2.0/fixtures/18535188?api_token=yJa5UcHQ0V22MXG9wlpQ3vtf8ucr6GzJJdd0IShA2j5wOSatggY783JolO6J&include=stats,localTeam,visitorTeam,highlights,events,lineup.player.country,referee,venue,substitutions.player.country`
);

// GET Team fixture stats using and Team Id and range of dates
const { data: commentary, error: commentryError } = useFetch(
  () =>
    `https://soccer.sportmonks.com/api/v2.0/commentaries/fixture/18535188?api_token=yJa5UcHQ0V22MXG9wlpQ3vtf8ucr6GzJJdd0IShA2j5wOSatggY783JolO6J`
);

const { data: headToHead, error: headToHeadError } = useFetch(
  () =>
    `https://soccer.sportmonks.com/api/v2.0/head2head/63/71?api_token=yJa5UcHQ0V22MXG9wlpQ3vtf8ucr6GzJJdd0IShA2j5wOSatggY783JolO6J&include=localTeam,visitorTeam`
);

if (fixDetail) {
  // localTeamFormation.value =
  //   fixDetail.value.data.formations.localteam_formation.split("-");
  // visitorTeamFormation.value =
  //   fixDetail.value.data.formations.visitorteam_formation.split("-");

  // // localTeamFormation.value = localTeamFormation.value.split("-");
  // // visitorTeamFormation.value = visitorTeamFormation.value.split("-");

  // console.log("local", localTeamFormation.value);
  // console.log("visitor", visitorTeamFormation.value);
  if (
    fixDetail.value.data.localteam_id ===
    fixDetail.value.data.stats.data[0].team_id
  ) {
    console.log("local team if part");
    localTeamStats.value = fixDetail.value.data.stats.data[0];
  } else {
    console.log("local team else part");

    localTeamStats.value = fixDetail.value.data.stats.data[1];
  }

  if (
    fixDetail.value.data.visitorteam_id ===
    fixDetail.value.data.stats.data[0].team_id
  ) {
    console.log("visitor team if part");

    visitorTeamStats.value = fixDetail.value.data.stats.data[0];
  } else {
    console.log("visitor team else part");

    visitorTeamStats.value = fixDetail.value.data.stats.data[1];
  }
} else {
  console.log("waiting");
}

// };
const changeTabs = function (tab, type) {
  tab_id.value = tab;
};

const changeTopTabs = function (tab, type) {
  top_tab_id.value = tab;
};
// mounted(() => {
// checkTeams();
// })
</script>

<template>
  <div class="w-9/10 md:w-4/5 mx-auto p-5" v-if="fixDetail">
    <!-- add section -->
    <div
      class="bg-rose-500 text-white rounded-lg py-2 px-2 mb-5 transition delay-150 duration-300 ease-in-out"
    >
      <div class="flex justify-between py-5">
        <p class="text-3xl">Ad display here</p>
      </div>
    </div>
    <!-- add section -->
    <div class="grid grid-cols-3 border-b pb-6">
      <div class="text-center self-center">
        <img
          :src="fixDetail.data.localTeam.data.logo_path"
          class="w-16 md:w-32 border p-3 mx-auto rounded"
          alt=""
        />

        <p class="mt-3 font-semibold">
          {{ fixDetail.data.localTeam.data.name }}
        </p>
      </div>
      <div class="text-center font-medium self-center">
        <div>{{ fixDetail.data.time.starting_at.date_time }}</div>
        <div class="text-4xl md:text-6xl lining-nums">
          {{ fixDetail.data.scores.localteam_score }} -
          {{ fixDetail.data.scores.visitorteam_score }}
        </div>
      </div>
      <div class="text-center self-center">
        <img
          :src="fixDetail.data.visitorTeam.data.logo_path"
          class="w-16 md:w-32 border p-3 mx-auto rounded"
          alt=""
        />
        <p class="mt-3 font-semibold">
          {{ fixDetail.data.visitorTeam.data.name }}
        </p>
      </div>
    </div>

    <div class="py-2 border-b">
      <div class="flex justify-start flex-wrap uppercase text-sm">
        <div
          @click="changeTopTabs('match')"
          :class="[
            top_tab_id === 'match'
              ? 'bg-[#0d406a] font-medium'
              : 'bg-white text-black',
          ]"
          class="mr-3 px-5 py-2 bg-[#0d406a] text-white text-center cursor-pointer rounded"
        >
          MATCH
        </div>
        <!-- <div
          @click="changeTopTabs('odds')"
          :class="[
            top_tab_id === 'odds'
              ? 'bg-[#0d406a] font-medium'
              : 'bg-white text-black',
          ]"
          class="mr-3 px-5 py-2 bg-[#0d406a] text-white text-center cursor-pointer rounded"
        >
          ODDS
        </div> -->
        <div
          @click="changeTopTabs('h2h')"
          :class="[
            top_tab_id === 'h2h'
              ? 'bg-[#0d406a] font-medium'
              : 'bg-white text-black',
          ]"
          class="mr-3 px-5 py-2 bg-[#0d406a] text-white text-center cursor-pointer rounded"
        >
          h2H
        </div>
        <div
          @click="changeTopTabs('standings')"
          :class="[
            top_tab_id === 'standings'
              ? 'bg-[#0d406a] font-medium'
              : 'bg-white text-black',
          ]"
          class="mr-3 px-5 py-2 bg-[#0d406a] text-white text-center cursor-pointer rounded"
        >
          Standings
        </div>
        <div
          @click="changeTopTabs('video')"
          :class="[
            top_tab_id === 'video'
              ? 'bg-[#0d406a] font-medium'
              : 'bg-white text-black',
          ]"
          class="mr-3 px-5 py-2 bg-[#0d406a] text-white text-center cursor-pointer rounded"
        >
          VIdeo
        </div>
      </div>
    </div>

    <div v-if="top_tab_id === 'match'">
      <div class="py-2 border-b">
        <div class="flex justify-start flex-wrap uppercase text-sm">
          <div
            @click="changeTabs('A')"
            :class="[
              tab_id === 'A'
                ? 'bg-[#0d406a] font-medium'
                : 'bg-white text-black',
            ]"
            class="mr-3 px-5 py-2 bg-[#0d406a] text-white text-center cursor-pointer rounded"
          >
            Summary
          </div>
          <div
            @click="changeTabs('B')"
            :class="[
              tab_id === 'B'
                ? 'bg-[#0d406a] font-medium'
                : 'bg-white text-black',
            ]"
            class="mr-3 px-5 py-2 bg-[#0d406a] text-white text-center cursor-pointer rounded"
          >
            Stats
          </div>
          <div
            @click="changeTabs('C')"
            :class="[
              tab_id === 'C'
                ? 'bg-[#0d406a] font-medium'
                : 'bg-white text-black',
            ]"
            class="mr-3 px-5 py-2 bg-[#0d406a] text-white text-center cursor-pointer rounded"
          >
            Lineup
          </div>
          <div
            @click="changeTabs('D')"
            :class="[
              tab_id === 'D'
                ? 'bg-[#0d406a] font-medium'
                : 'bg-white text-black',
            ]"
            class="mr-3 px-5 py-2 bg-[#0d406a] text-white text-center cursor-pointer rounded"
          >
            commentary
          </div>
        </div>
      </div>

      <div v-if="tab_id === 'A'">
        <div class="text-xs" v-if="fixDetail.data.events.data.length !== 0">
          <div
            class="flex justify-between p-2 mb-2 text-sm bg-[#0d406a] text-white rounded"
          >
            <p>1st Half</p>
            <p>{{ fixDetail.data.scores.ht_score }}</p>
          </div>

          <div class="grid mb-2">
            <div>
              <div v-for="e in fixDetail.data.events.data">
                <div
                  v-if="
                    e.team_id == fixDetail.data.localteam_id && e.minute <= 45
                  "
                >
                  <span class="mr-2">{{ e.minute }}' </span>
                  <span class="mr-2">{{ e.player_name }}</span>
                  <span class="mr-2">{{ e.type }}</span>
                </div>
                <div
                  class="flex justify-end"
                  v-if="
                    e.team_id == fixDetail.data.visitorteam_id && e.minute <= 45
                  "
                >
                  <span class="mr-2">{{ e.type }}</span>
                  <span class="mr-2">{{ e.player_name }}</span>
                  <span class="mr-2">{{ e.minute }}' </span>
                </div>
              </div>
            </div>
          </div>

          <div
            class="flex justify-between p-2 mb-2 text-sm bg-[#0d406a] text-white rounded"
          >
            <p>2nd Half</p>
            <p
              v-if="
                fixDetail.data.scores.ht_score !==
                fixDetail.data.scores.ft_score
              "
            >
              {{ fixDetail.data.scores.ft_score }}
            </p>
            <p v-else>0-0</p>
          </div>

          <div class="grid mb-2">
            <div v-for="e in fixDetail.data.events.data">
              <div
                v-if="e.team_id == fixDetail.data.localteam_id && e.minute > 45"
              >
                <span class="mr-2">{{ e.minute }}' </span>
                <span class="mr-2">{{ e.player_name }}</span>
                <span class="mr-2">{{ e.type }}</span>
              </div>
              <div
                class="flex justify-end"
                v-if="
                  e.team_id == fixDetail.data.visitorteam_id && e.minute > 45
                "
              >
                <span class="mr-2">{{ e.type }}</span>
                <span class="mr-2">{{ e.player_name }}</span>
                <span class="mr-2">{{ e.minute }}' </span>
              </div>
            </div>
          </div>

          <div
            class="flex justify-between p-2 mb-2 text-sm bg-[#0d406a] text-white rounded"
          >
            <p>MATCH INFORMATION</p>
          </div>

          <div class="text-xs">
            <div class="flex justify-between">
              <p>REFEREE</p>
              <p>{{ fixDetail.data.referee.data.common_name }}</p>
            </div>
            <div class="flex justify-between">
              <p>VENUE</p>
              <p>{{ fixDetail.data.venue.data.name }}</p>
            </div>
            <div class="flex justify-between" v-if="fixDetail.data.attendance">
              <p>ATTENDANCE</p>
              <p>{{ fixDetail.data.attendance }}</p>
            </div>
          </div>
        </div>
      </div>
      <div v-if="tab_id === 'B'">
        <div
          v-if="fixDetail.data.stats.data.length !== 0"
          class="mt-3 text-xs font-semibold"
        >
          <div id="possession" class="mb-4">
            <div class="flex justify-between">
              <p>{{ localTeamStats.possessiontime }}</p>
              <p>Ball Possession</p>
              <p>{{ visitorTeamStats.possessiontime }}</p>
            </div>
            <div class="flex">
              <progress
                class="w-full rotate-180 h-2 mr-1"
                :value="localTeamStats.possessiontime"
                min="0"
                :max="
                  localTeamStats.possessiontime +
                  visitorTeamStats.possessiontime
                "
              ></progress>
              <progress
                class="w-full ml-1 h-2"
                :value="visitorTeamStats.possessiontime"
                min="0"
                :max="
                  localTeamStats.possessiontime +
                  visitorTeamStats.possessiontime
                "
              ></progress>
            </div>
          </div>

          <div id="goal_attempts" class="mb-4">
            <div class="flex justify-between">
              <p>{{ localTeamStats.goal_attempts }}</p>
              <p>Goal Attempts</p>
              <p>{{ visitorTeamStats.goal_attempts }}</p>
            </div>
            <div class="flex">
              <progress
                class="w-full rotate-180 h-2 mr-1 rounded"
                :value="localTeamStats.goal_attempts"
                min="0"
                :max="
                  localTeamStats.goal_attempts + visitorTeamStats.goal_attempts
                "
              ></progress>
              <progress
                class="w-full ml-1 h-2 rounded"
                :value="visitorTeamStats.goal_attempts"
                min="0"
                :max="
                  localTeamStats.goal_attempts + visitorTeamStats.goal_attempts
                "
              ></progress>
            </div>
          </div>

          <div id="shots_ongoal" class="mb-4">
            <div class="flex justify-between">
              <p>{{ localTeamStats.shots.ongoal }}</p>
              <p>Shots on Goal</p>
              <p>{{ visitorTeamStats.shots.ongoal }}</p>
            </div>
            <div class="flex">
              <progress
                class="w-full rotate-180 h-2 mr-1 rounded"
                :value="localTeamStats.shots.ongoal"
                min="0"
                :max="
                  localTeamStats.shots.ongoal + visitorTeamStats.shots.ongoal
                "
              ></progress>
              <progress
                class="w-full ml-1 h-2 rounded"
                :value="visitorTeamStats.shots.ongoal"
                min="0"
                :max="
                  localTeamStats.shots.ongoal + visitorTeamStats.shots.ongoal
                "
              ></progress>
            </div>
          </div>

          <div id="shots_offgoal" class="mb-4">
            <div class="flex justify-between">
              <p>{{ localTeamStats.shots.offgoal }}</p>
              <p>Shots off Goal</p>
              <p>{{ visitorTeamStats.shots.offgoal }}</p>
            </div>
            <div class="flex">
              <progress
                class="w-full rotate-180 h-2 mr-1 rounded"
                :value="localTeamStats.shots.offgoal"
                min="0"
                :max="
                  localTeamStats.shots.offgoal + visitorTeamStats.shots.offgoal
                "
              ></progress>
              <progress
                class="w-full ml-1 h-2 rounded"
                :value="visitorTeamStats.shots.offgoal"
                min="0"
                :max="
                  localTeamStats.shots.offgoal + visitorTeamStats.shots.offgoal
                "
              ></progress>
            </div>
          </div>

          <div id="shots_blocked" class="mb-4">
            <div class="flex justify-between">
              <p>{{ localTeamStats.shots.blocked }}</p>
              <p>Shots Blocked</p>
              <p>{{ visitorTeamStats.shots.blocked }}</p>
            </div>
            <div class="flex">
              <progress
                class="w-full rotate-180 h-2 mr-1 rounded"
                :value="localTeamStats.shots.blocked"
                min="0"
                :max="
                  localTeamStats.shots.blocked + visitorTeamStats.shots.blocked
                "
              ></progress>
              <progress
                class="w-full ml-1 h-2 rounded"
                :value="visitorTeamStats.shots.blocked"
                min="0"
                :max="
                  localTeamStats.shots.blocked + visitorTeamStats.shots.blocked
                "
              ></progress>
            </div>
          </div>

          <div id="free_kick" class="mb-4">
            <div class="flex justify-between">
              <p>{{ localTeamStats.free_kick }}</p>
              <p>Free Kicks</p>
              <p>{{ visitorTeamStats.free_kick }}</p>
            </div>
            <div class="flex">
              <progress
                class="w-full rotate-180 h-2 mr-1 rounded"
                :value="localTeamStats.free_kick"
                min="0"
                :max="localTeamStats.free_kick + visitorTeamStats.free_kick"
              ></progress>
              <progress
                class="w-full ml-1 h-2 rounded"
                :value="visitorTeamStats.free_kick"
                min="0"
                :max="localTeamStats.free_kick + visitorTeamStats.free_kick"
              ></progress>
            </div>
          </div>

          <div id="corners" class="mb-4">
            <div class="flex justify-between">
              <p>{{ localTeamStats.corners }}</p>
              <p>Corners</p>
              <p>{{ visitorTeamStats.corners }}</p>
            </div>
            <div class="flex">
              <progress
                class="w-full rotate-180 h-2 mr-1 rounded"
                :value="localTeamStats.corners"
                min="0"
                :max="localTeamStats.corners + visitorTeamStats.corners"
              ></progress>
              <progress
                class="w-full ml-1 h-2 rounded"
                :value="visitorTeamStats.corners"
                min="0"
                :max="localTeamStats.corners + visitorTeamStats.corners"
              ></progress>
            </div>
          </div>

          <div id="offsides" class="mb-4">
            <div class="flex justify-between">
              <p>{{ localTeamStats.offsides }}</p>
              <p>Offsides</p>
              <p>{{ visitorTeamStats.offsides }}</p>
            </div>
            <div class="flex">
              <progress
                class="w-full rotate-180 h-2 mr-1 rounded"
                :value="localTeamStats.offsides"
                min="0"
                :max="localTeamStats.offsides + visitorTeamStats.offsides"
              ></progress>
              <progress
                class="w-full ml-1 h-2 rounded"
                :value="visitorTeamStats.offsides"
                min="0"
                :max="localTeamStats.offsides + visitorTeamStats.offsides"
              ></progress>
            </div>
          </div>

          <div id="throw_in" class="mb-4">
            <div class="flex justify-between">
              <p>{{ localTeamStats.throw_in }}</p>
              <p>Throw in</p>
              <p>{{ visitorTeamStats.throw_in }}</p>
            </div>
            <div class="flex">
              <progress
                class="w-full rotate-180 h-2 mr-1 rounded"
                :value="localTeamStats.throw_in"
                min="0"
                :max="localTeamStats.throw_in + visitorTeamStats.throw_in"
              ></progress>
              <progress
                class="w-full ml-1 h-2 rounded"
                :value="visitorTeamStats.throw_in"
                min="0"
                :max="localTeamStats.throw_in + visitorTeamStats.throw_in"
              ></progress>
            </div>
          </div>

          <div id="saves" class="mb-4">
            <div class="flex justify-between">
              <p>{{ localTeamStats.saves }}</p>
              <p>Goalkeeper Saves</p>
              <p>{{ visitorTeamStats.saves }}</p>
            </div>
            <div class="flex">
              <progress
                class="w-full rotate-180 h-2 mr-1 rounded"
                :value="localTeamStats.saves"
                min="0"
                :max="localTeamStats.saves + visitorTeamStats.saves"
              ></progress>
              <progress
                class="w-full ml-1 h-2 rounded"
                :value="visitorTeamStats.saves"
                min="0"
                :max="localTeamStats.saves + visitorTeamStats.saves"
              ></progress>
            </div>
          </div>

          <div id="fouls" class="mb-4">
            <div class="flex justify-between">
              <p>{{ localTeamStats.fouls }}</p>
              <p>Fouls</p>
              <p>{{ visitorTeamStats.fouls }}</p>
            </div>
            <div class="flex">
              <progress
                class="w-full rotate-180 h-2 mr-1 rounded"
                :value="localTeamStats.fouls"
                min="0"
                :max="localTeamStats.fouls + visitorTeamStats.fouls"
              ></progress>
              <progress
                class="w-full ml-1 h-2 rounded"
                :value="visitorTeamStats.fouls"
                min="0"
                :max="localTeamStats.fouls + visitorTeamStats.fouls"
              ></progress>
            </div>
          </div>

          <div id="yellowcards" class="mb-4">
            <div class="flex justify-between">
              <p>{{ localTeamStats.yellowcards }}</p>
              <p>Yellow Cards</p>
              <p>{{ visitorTeamStats.yellowcards }}</p>
            </div>
            <div class="flex">
              <progress
                class="w-full rotate-180 h-2 mr-1 rounded"
                :value="localTeamStats.yellowcards"
                min="0"
                :max="localTeamStats.yellowcards + visitorTeamStats.yellowcards"
              ></progress>
              <progress
                class="w-full ml-1 h-2 rounded"
                :value="visitorTeamStats.yellowcards"
                min="0"
                :max="localTeamStats.yellowcards + visitorTeamStats.yellowcards"
              ></progress>
            </div>
          </div>

          <div id="total_passes" class="mb-4">
            <div class="flex justify-between">
              <p>{{ localTeamStats.passes.total }}</p>
              <p>Total Passes</p>
              <p>{{ visitorTeamStats.passes.total }}</p>
            </div>
            <div class="flex">
              <progress
                class="w-full rotate-180 h-2 mr-1 rounded"
                :value="localTeamStats.passes.total"
                min="0"
                :max="
                  localTeamStats.passes.total + visitorTeamStats.passes.total
                "
              ></progress>
              <progress
                class="w-full ml-1 h-2 rounded"
                :value="visitorTeamStats.passes.total"
                min="0"
                :max="
                  localTeamStats.passes.total + visitorTeamStats.passes.total
                "
              ></progress>
            </div>
          </div>

          <div id="accurate_passes" class="mb-4">
            <div class="flex justify-between">
              <p>{{ localTeamStats.passes.accurate }}</p>
              <p>Accurate Passes</p>
              <p>{{ visitorTeamStats.passes.accurate }}</p>
            </div>
            <div class="flex">
              <progress
                class="w-full rotate-180 h-2 mr-1 rounded"
                :value="localTeamStats.passes.accurate"
                min="0"
                :max="
                  localTeamStats.passes.accurate +
                  visitorTeamStats.passes.accurate
                "
              ></progress>
              <progress
                class="w-full ml-1 h-2 rounded"
                :value="visitorTeamStats.passes.accurate"
                min="0"
                :max="
                  localTeamStats.passes.accurate +
                  visitorTeamStats.passes.accurate
                "
              ></progress>
            </div>
          </div>

          <div id="tackles" class="mb-4">
            <div class="flex justify-between">
              <p>{{ localTeamStats.tackles }}</p>
              <p>Tackles</p>
              <p>{{ visitorTeamStats.tackles }}</p>
            </div>
            <div class="flex">
              <progress
                class="w-full rotate-180 h-2 mr-1 rounded"
                :value="localTeamStats.tackles"
                min="0"
                :max="localTeamStats.tackles + visitorTeamStats.tackles"
              ></progress>
              <progress
                class="w-full ml-1 h-2 rounded"
                :value="visitorTeamStats.tackles"
                min="0"
                :max="localTeamStats.tackles + visitorTeamStats.tackles"
              ></progress>
            </div>
          </div>

          <div id="attacks" class="mb-4">
            <div class="flex justify-between">
              <p>{{ localTeamStats.attacks.attacks }}</p>
              <p>Attacks</p>
              <p>{{ visitorTeamStats.attacks.attacks }}</p>
            </div>
            <div class="flex">
              <progress
                class="w-full rotate-180 h-2 mr-1 rounded"
                :value="localTeamStats.attacks.attacks"
                min="0"
                :max="
                  localTeamStats.attacks.attacks +
                  visitorTeamStats.attacks.attacks
                "
              ></progress>
              <progress
                class="w-full ml-1 h-2 rounded"
                :value="visitorTeamStats.attacks.attacks"
                min="0"
                :max="
                  localTeamStats.attacks.attacks +
                  visitorTeamStats.attacks.attacks
                "
              ></progress>
            </div>
          </div>

          <div id="dangerous_attacks" class="mb-4">
            <div class="flex justify-between">
              <p>{{ localTeamStats.attacks.dangerous_attacks }}</p>
              <p>Dangerous Attacks</p>
              <p>{{ visitorTeamStats.attacks.dangerous_attacks }}</p>
            </div>
            <div class="flex">
              <progress
                class="w-full rotate-180 h-2 mr-1 rounded"
                :value="localTeamStats.attacks.dangerous_attacks"
                min="0"
                :max="
                  localTeamStats.attacks.dangerous_attacks +
                  visitorTeamStats.attacks.dangerous_attacks
                "
              ></progress>
              <progress
                class="w-full ml-1 h-2 rounded"
                :value="visitorTeamStats.attacks.dangerous_attacks"
                min="0"
                :max="
                  localTeamStats.attacks.dangerous_attacks +
                  visitorTeamStats.attacks.dangerous_attacks
                "
              ></progress>
            </div>
          </div>
        </div>

        <!-- <div class="flex">
        <div class="w-full bg-gray-400">
          <div
            :style="{ width: localTeamStats.possessiontime }"
            :class="
              localTeamStats.possessiontime > visitorTeamStats.possessiontime
                ? 'bg-rose-400'
                : ''
            "
          >
            1
          </div>
        </div>
        <div class="w-full bg-gray-400">
          <div
            :style="{ width: visitorTeamStats.possessiontime }"
            :class="
              visitorTeamStats.possessiontime > localTeamStats.possessiontime
                ? 'bg-rose-400'
                : ''
            "
          >
            2
          </div>
        </div>
      </div> -->
        <!-- <div class="w-full bg-gray-400">
        <div
          :style="{ width: localTeamStats.possessiontime }"
          :class="
            localTeamStats.possessiontime > visitorTeamStats.possessiontime
              ? 'bg-rose-400'
              : ''
          "
        >
          jjhfhfjfj
        </div>
      </div> -->
      </div>
      <div v-if="tab_id === 'C'">
        <div
          class="text-center p-2 mb-2 text-sm bg-[#0d406a] text-white rounded"
        >
          <p>STARTING LINEUPS</p>
        </div>

        <div class="flex justify-between text-xs mb-2">
          <div class="mr-1">
            <div v-for="player in fixDetail.data.lineup.data">
              <div
                class="flex mb-3 py-2 hover:bg-gray-200"
                v-if="player.team_id === fixDetail.data.localteam_id"
              >
                <p class="w-8 self-center">{{ player.number }}</p>
                <img
                  :src="player.player.data.country.data.image_path"
                  class="w-5 h-3 mr-3 self-center"
                />
                <p class="self-center">{{ player.player_name }}</p>
              </div>
            </div>
          </div>
          <div class="text-right ml-1">
            <div v-for="player in fixDetail.data.lineup.data">
              <div
                class="flex justify-end py-2 mb-3"
                v-if="player.team_id === fixDetail.data.visitorteam_id"
              >
                <p class="self-center">{{ player.player_name }}</p>
                <img
                  :src="player.player.data.country.data.image_path"
                  class="w-5 h-3 ml-3 self-center"
                />
                <p class="w-8 self-center">{{ player.number }}</p>
              </div>
            </div>
          </div>
        </div>

        <div
          class="text-center p-2 mb-2 text-sm bg-[#0d406a] text-white rounded"
        >
          <p>SUBSTITUTE</p>
        </div>

        <div class="flex justify-between text-xs mb-2">
          <div class="mr-1">
            <div v-for="player in fixDetail.data.substitutions.data">
              <div
                class="flex mb-3 py-2 hover:bg-gray-200"
                v-if="player.team_id == fixDetail.data.localteam_id"
              >
                <p class="w-8 self-center">{{ player.minute }}'</p>
                <img
                  :src="player.player.data.country.data.image_path"
                  class="w-5 h-3 mr-3 self-center"
                />
                <p class="self-center">
                  {{ player.player_in_name }}
                  <strong class="pl-2 text-gray-500"
                    >({{ player.player_out_name }})</strong
                  >
                </p>
              </div>
            </div>
          </div>
          <div class="text-right ml-1">
            <div v-for="player in fixDetail.data.substitutions.data">
              <div
                class="flex justify-end py-2 mb-3"
                v-if="player.team_id == fixDetail.data.visitorteam_id"
              >
                <p class="self-center">
                  <strong class="pr-2 text-gray-500"
                    >({{ player.player_out_name }})</strong
                  >
                  {{ player.player_in_name }}
                </p>
                <img
                  :src="player.player.data.country.data.image_path"
                  class="w-5 h-3 ml-3 self-center"
                />
                <p class="w-8 self-center">{{ player.minute }}'</p>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="football-field">
        <div class="flex justify-evenly mb-4">
          <div class="bg-yellow-400 w-5">jjf</div>
        </div>
        <div class="flex justify-evenly mb-4">
          <div class=" w-5">jjf</div>
          <div class="w-5">jjf</div>
          <div class="bg-yellow-400 w-5">jjf</div>
          <div class="bg-blue-400 w-5">jjf</div>
        </div>
        <div class="flex justify-evenly mb-4">
          <div class="w-5">jjf</div>
          <div class="bg-blue-400 w-5">jjf</div>
          <div class="bg-yellow-400 w-5">jjf</div>
        </div>
        <div class="flex justify-evenly mb-4">
          <div class="bg-yellow-400 w-5">jjf</div>
        </div>
        <div class="flex justify-evenly mb-4">
          <div class="bg-blue-400 w-5">jjf</div>
          <div class="bg-yellow-400 w-5">jjf</div>
        </div>
      </div> -->
      </div>
      <div v-if="tab_id === 'D'">
        <div v-for="com in commentary.data">
          <div class="mb-4 text-xs">
            <div class="font-semibold mr-3">
              {{ com.minute }}'
              <span v-if="com.extra_minute">+ ({{ com.extra_minute }})</span>
            </div>
            <div :class="com.important ? 'bg-slate-200' : ''">
              {{ com.comment }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- <div v-if="top_tab_id === 'odds'">this is odds</div> -->
    <div v-if="top_tab_id === 'h2h'">
      <!-- {{ headToHead.data }} -->

      <div
        class="flex justify-between p-2 mb-2 text-sm bg-[#0d406a] text-white rounded"
      >
        <p>HEAD-TO-HEAD MATCHES</p>
      </div>
      <!-- {{ headToHead.data }} -->

      <div v-for="(match, index) in headToHead.data">
        <div
          class="flex justify-start mb-3 p-1 text-xs rounded border hover:bg-slate-300 hover:cursor-pointer"
          :class="index % 2 === 0 ? 'bg-slate-200' : ''"
        >
          <div class="self-center w-20">
            <p>{{ match.time.starting_at.date }}</p>
          </div>
          <div class="w-full md:w-3/5">
            <div
              class="flex justify-between py-1"
              :class="[
                match.winner_team_id === match.localteam_id
                  ? 'font-bold'
                  : 'font-normal',
              ]"
            >
              <div class="flex justify-start">
                <img
                  :src="match.localTeam.data.logo_path"
                  class="w-6 self-center"
                  alt=""
                />
                <p class="self-center">{{ match.localTeam.data.name }}</p>
              </div>
              <div>
                <p class="self-center">{{ match.scores.localteam_score }}</p>
              </div>
            </div>
            <div
              class="flex justify-between py-1"
              :class="[
                match.winner_team_id === match.visitorteam_id
                  ? 'font-bold'
                  : 'font-normal',
              ]"
            >
              <div class="flex justify-start">
                <img
                  :src="match.visitorTeam.data.logo_path"
                  class="w-6 self-center"
                  alt=""
                />
                <p class="self-center">{{ match.visitorTeam.data.name }}</p>
              </div>
              <div>
                <p class="self-center">{{ match.scores.visitorteam_score }}</p>
              </div>
            </div>
          </div>
        </div>
        <div></div>
      </div>
      <!-- <HeadToHead /> -->
    </div>
    <div v-if="top_tab_id === 'standings'">
      <div class="py-5 bg-rose-700 text-white">
        This is testing for api call on load
      </div>
      <div>
        <HeadToHead />
      </div>
    </div>
    <div v-if="top_tab_id === 'video'">this is video</div>
  </div>
</template>

<style scoped>
* {
  font-family: Arial, sans-serif;
}

progress {
  border-radius: 2px;
}
progress::-webkit-progress-bar {
  background-color: #eee;
  border-radius: 2px;
}
progress::-webkit-progress-value {
  background-color: #0d406a;
  border-radius: 2px;
}
/* progress::-moz-progress-bar {
 
} */

.football-field {
  background-image: url(@assets/football-field.png);
  background-repeat: no-repeat;
  background-position: center;
}
</style>
<!-- <div class="p-5 bg-rose-400">test section</div>
    {{ localTeamFormation }}
    {{ visitorTeamFormation }}

    <div v-for="local in localTeamFormation" class="relative">
      <div v-for="l in parseInt(local)" class="inline-grid grid-cols-4">
        <div class="bg-red-400 px-3">{{ l }}</div>
      </div>
    </div>

    <div class="py-5 bg-green-500"></div>
    <div v-for="local in visitorTeamFormation">
      <div v-for="l in parseInt(local)" class="inline-grid">
        <div>{{ l }}</div>
      </div>
    </div> -->
