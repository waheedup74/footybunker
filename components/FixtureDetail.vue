<script setup>
const route = useRoute();
const commentary = ref({});
const props = defineProps({
  fixture: Object,
});

const localTeamStats = ref({});
const visitorTeamStats = ref({});
const tab_id = ref("A");
onMounted(async () => {
  commentary.value = await useFetch(
    () =>
      `https://soccer.sportmonks.com/api/v2.0/commentaries/fixture/${props.fixture.id}?api_token=yJa5UcHQ0V22MXG9wlpQ3vtf8ucr6GzJJdd0IShA2j5wOSatggY783JolO6J`
  );
});
onBeforeMount(() => {
  checkTeamIds();
});
const checkTeamIds = function () {
  if (props.fixture?.localteam_id === props.fixture.stats.data[0].team_id) {
    localTeamStats.value = props.fixture.stats.data[0];
  } else {
    localTeamStats.value = props.fixture.stats.data[1];
  }

  if (props.fixture?.visitorteam_id === props.fixture.stats.data[0].team_id) {
    visitorTeamStats.value = props.fixture.stats.data[0];
  } else {
    visitorTeamStats.value = props.fixture.stats.data[1];
  }
};
const changeTabs = function (tab, type) {
  tab_id.value = tab;
};
</script>
<template>
  <div v-if="fixture">
    <div class="py-2 border-b">
      <div class="flex justify-start flex-wrap uppercase text-sm">
        <div
          @click="changeTabs('A')"
          :class="[
            tab_id === 'A' ? 'bg-[#0d406a] font-medium' : 'bg-white text-black',
          ]"
          class="mr-3 px-5 py-2 bg-[#0d406a] text-white text-center cursor-pointer rounded"
        >
          Summary
        </div>
        <div
          @click="changeTabs('B')"
          :class="[
            tab_id === 'B' ? 'bg-[#0d406a] font-medium' : 'bg-white text-black',
          ]"
          class="mr-3 px-5 py-2 bg-[#0d406a] text-white text-center cursor-pointer rounded"
        >
          Stats
        </div>
        <div
          @click="changeTabs('C')"
          :class="[
            tab_id === 'C' ? 'bg-[#0d406a] font-medium' : 'bg-white text-black',
          ]"
          class="mr-3 px-5 py-2 bg-[#0d406a] text-white text-center cursor-pointer rounded"
        >
          Lineup
        </div>
        <div
          @click="changeTabs('D')"
          :class="[
            tab_id === 'D' ? 'bg-[#0d406a] font-medium' : 'bg-white text-black',
          ]"
          class="mr-3 px-5 py-2 bg-[#0d406a] text-white text-center cursor-pointer rounded"
        >
          commentary
        </div>
      </div>
    </div>
    <div v-if="tab_id === 'A'">
      <div class="text-xs" v-if="fixture.events.data.length !== 0">
        <div
          class="flex justify-between p-2 mb-2 text-sm bg-[#0d406a] text-white rounded"
        >
          <p>1st Half</p>
          <p>{{ fixture.scores.ht_score }}</p>
        </div>
        <div class="grid mb-2">
          <div>
            <div v-for="e in fixture.events.data">
              <div v-if="e.team_id == fixture?.localteam_id && e.minute <= 45">
                <span class="mr-2">{{ e.minute }}' </span>
                <span class="mr-2">{{ e.player_name }}</span>
                <span class="mr-2">{{ e.type }}</span>
              </div>
              <div
                class="flex justify-end"
                v-if="e.team_id == fixture?.visitorteam_id && e.minute <= 45"
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
          <p v-if="fixture.scores.ht_score !== fixture.scores.ft_score">
            {{ fixture.scores.ft_score }}
          </p>
          <p v-else>0-0</p>
        </div>

        <div class="grid mb-2">
          <div v-for="e in fixture.events.data">
            <div v-if="e.team_id == fixture?.localteam_id && e.minute > 45">
              <span class="mr-2">{{ e.minute }}' </span>
              <span class="mr-2">{{ e.player_name }}</span>
              <span class="mr-2">{{ e.type }}</span>
            </div>
            <div
              class="flex justify-end"
              v-if="e.team_id == fixture?.visitorteam_id && e.minute > 45"
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
            <p>{{ fixture.referee.data.common_name }}</p>
          </div>
          <div class="flex justify-between">
            <p>VENUE</p>
            <p>{{ fixture.venue.data.name }}</p>
          </div>
          <div class="flex justify-between" v-if="fixture.attendance">
            <p>ATTENDANCE</p>
            <p>{{ fixture.attendance }}</p>
          </div>
        </div>
      </div>
    </div>
    <div v-if="tab_id === 'B'">
      <div
        v-if="fixture.stats.data.length !== 0"
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
                localTeamStats.possessiontime + visitorTeamStats.possessiontime
              "
            ></progress>
            <progress
              class="w-full ml-1 h-2"
              :value="visitorTeamStats.possessiontime"
              min="0"
              :max="
                localTeamStats.possessiontime + visitorTeamStats.possessiontime
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
              :max="localTeamStats.shots.ongoal + visitorTeamStats.shots.ongoal"
            ></progress>
            <progress
              class="w-full ml-1 h-2 rounded"
              :value="visitorTeamStats.shots.ongoal"
              min="0"
              :max="localTeamStats.shots.ongoal + visitorTeamStats.shots.ongoal"
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
              :max="localTeamStats.passes.total + visitorTeamStats.passes.total"
            ></progress>
            <progress
              class="w-full ml-1 h-2 rounded"
              :value="visitorTeamStats.passes.total"
              min="0"
              :max="localTeamStats.passes.total + visitorTeamStats.passes.total"
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
    </div>
    <div v-if="tab_id === 'C'">
      <div class="text-center p-2 mb-2 text-sm bg-[#0d406a] text-white rounded">
        <p>STARTING LINEUPS</p>
      </div>

      <div class="flex justify-between text-xs mb-2">
        <div class="mr-1">
          <div v-for="player in fixture.lineup.data">
            <div
              class="flex mb-3 py-2 hover:bg-gray-200"
              v-if="player.team_id === fixture.localteam_id"
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
          <div v-for="player in fixture.lineup.data">
            <div
              class="flex justify-end py-2 mb-3"
              v-if="player.team_id === fixture.visitorteam_id"
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

      <div class="text-center p-2 mb-2 text-sm bg-[#0d406a] text-white rounded">
        <p>SUBSTITUTE</p>
      </div>

      <div class="flex justify-between text-xs mb-2">
        <div class="mr-1">
          <div v-for="player in fixture.substitutions.data">
            <div
              class="flex mb-3 py-2 hover:bg-gray-200"
              v-if="player.team_id == fixture.localteam_id"
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
          <div v-for="player in fixture.substitutions.data">
            <div
              class="flex justify-end py-2 mb-3"
              v-if="player.team_id == fixture.visitorteam_id"
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
    </div>
    <div v-if="tab_id === 'D'">
      <div v-if="commentary.data">
        <FixtureCommentary :commentary="commentary.data.data" />
      </div>
    </div>
  </div>
</template>
<style scoped>
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
</style>
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
