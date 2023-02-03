<script setup>
import { ref } from "vue";
const route = useRoute();
const teamId = parseInt(route.params.teamId);
let tab_id = ref("A");
const showRow = ref(false);
const showValue = ref("");
const showStats = ref("player");

// GET SQUAD using Season Id and Team Id
const { data: players, error: testError } = useFetch(
  () =>
    `https://soccer.sportmonks.com/api/v2.0/squad/season/19734/team/${teamId}?api_token=yJa5UcHQ0V22MXG9wlpQ3vtf8ucr6GzJJdd0IShA2j5wOSatggY783JolO6J&include=player`
);

// GET Team fixture stats using and Team Id and range of dates
const { data: allStats, error: statsError } = useFetch(
  () =>
    `https://soccer.sportmonks.com/api/v2.0/fixtures/between/2022-07-01/2023-01-31/${teamId}?api_token=yJa5UcHQ0V22MXG9wlpQ3vtf8ucr6GzJJdd0IShA2j5wOSatggY783JolO6J&include=stats,league,localTeam,visitorTeam`
);
// GET Team stats using and Team Id
const { data: team, error: teamError } = useFetch(
  () =>
    `https://soccer.sportmonks.com/api/v2.0/teams/${teamId}?api_token=yJa5UcHQ0V22MXG9wlpQ3vtf8ucr6GzJJdd0IShA2j5wOSatggY783JolO6J`
);
const changeTabs = (tab, section) => {
  tab_id.value = tab;
  showValue.value = "";
  showRow.value = true;
  showStats.value = section;
};

const toggleTeamStats = (value) => {
  showValue.value = value;
  showRow.value = true;
};

const goto = function (team) {
  navigateTo(`/team-${team}`);
};
</script>
<template>
  {{ statsError }}
  <div class="w-full sm:px-2 md:px-4 lg:px-12 py-8">
    <div class="flex justify-start text-gray-600">
      <a href="/" class="flex self-center mr-3"
        ><img src="@/assets/home.png" alt="" class="opacity-50"
      /></a>
      <span class="mr-3 self-center">
        <img src="@/assets/right.png" class="opacity-50" alt="" />
      </span>
      <a href="/Premier-league-standings" class="self-center">Premier League</a>
    </div>
    <div
      class="min-w-0 w-full flex-auto lg:static lg:max-h-full lg:overflow-visible"
    >
      <!-- Team and league section -->
      <div class="mt-4 md:mt-4 border rounded-md p-2 mb-5">
        <div class="grid md:grid-cols-2">
          <div class="flex justify-start" v-if="team">
            <img
              :src="team.data.logo_path"
              class="self-center w-12 md:w-16 mr-3"
              alt=""
            />
            <h1
              class="inline-block text-xl md:text-2xl self-center font-medium text-gray-900 tracking-tight capitalize"
            >
              {{ team.data.name }}
            </h1>
          </div>
          <!-- <div class="flex justify-start">
            <img
              src="https://cdn.sportmonks.com/images/soccer/leagues/8/8.png"
              class="self-center w-12 md:w-16 mr-3"
              alt=""
            />
            <h1
              class="inline-block text-xl md:text-2xl self-center font-medium text-gray-900 tracking-tight capitalize"
            >
              Premier League
            </h1>
          </div> -->
        </div>

        <!-- <div class="flex items-center mt-6">
          <select
            id="statsFilter"
            data-url="https://playerstats.football/premier-league/liverpool/shots-on-target"
            class="form-select mx-auto w-64 text-sm pt-1 border border-gray-600"
            name=""
          >
            <option value="all" data-type="period">Select Seasons</option>
            <option value="last-10" data-type="period">2020/2021</option>
            <option value="last-5" data-type="period" selected>
              2021/2022
            </option>
            <option value="last-10" data-type="period">2022/2023</option>
          </select>
        </div> -->
      </div>
      <!-- Team and league section -->

      <!-- add section -->
      <div
        class="bg-rose-500 text-white rounded-lg py-2 px-2 mb-5 transition delay-150 duration-300 ease-in-out"
      >
        <div class="flex justify-between py-5">
          <p class="text-3xl">Add display here</p>
        </div>
      </div>
      <!-- add section -->

      <!-- tabs section -->
      <div class="mb-6">
        <div class="grid grid-cols-3 mb-6">
          <div
            @click="changeTabs('A', 'player')"
            :class="[
              tab_id === 'A' ? 'bg-[#0d406a] font-medium' : 'bg-[#1D8AE0]',
            ]"
            class="border py-2 cursor-pointer rounded-t-lg hover:bg-[#0d406a] text-white text-lg text-center"
          >
            DEFENSIVE
          </div>
          <div
            @click="changeTabs('B', 'player')"
            :class="[
              tab_id === 'B' ? 'bg-[#0d406a]  font-medium ' : 'bg-[#1D8AE0]',
            ]"
            class="border py-2 cursor-pointer rounded-t-lg hover:bg-[#0d406a] text-white text-lg text-center"
          >
            OFFENSIVE
          </div>
          <div
            @click="changeTabs('C', 'team')"
            class="border py-2 cursor-pointer rounded-t-lg hover:bg-[#0d406a] text-white text-lg text-center"
            :class="[
              tab_id === 'C' ? 'bg-[#0d406a] font-medium' : 'bg-[#1D8AE0]',
            ]"
          >
            TEAM
          </div>
        </div>

        <div v-if="tab_id === 'A'">
          <div
            class="grid gap-1 text-sm grid-cols-4 md:grid-cols-6 lg:grid-cols-8 justify-between items-center"
          >
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white"
            >
              Interceptions
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white"
            >
              Tackles
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white"
            >
              Blocks
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white"
            >
              Total Duels
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white"
            >
              Duels Won
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white"
            >
              Fouls Committed
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white"
            >
              Penalties Saved
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white"
            >
              Dribbled Past
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white"
            >
              Penalties Committed
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white"
            >
              Yellows
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white"
            >
              test
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white"
            >
              Reds
            </div>
          </div>
        </div>
        <div v-if="tab_id === 'B'">
          <div
            class="grid gap-2 grid-cols-4 md:grid-cols-6 lg:grid-cols-8 justify-between items-center"
          >
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white"
            >
              Fouls Drawn
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white"
            >
              Penalties Won
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white"
            >
              Key Passes
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white"
            >
              Total Passes
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white"
            >
              Penalties Scored
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white"
            >
              Penalties Missed
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white"
            >
              Total Shots
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white"
            >
              Shots On target
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white"
            >
              Offside
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white"
            >
              Hit Post
            </div>
          </div>
        </div>
        <div v-if="tab_id === 'C'">
          <div
            class="grid gap-2 grid-cols-3 md:grid-cols-5 lg:grid-cols-7 justify-between items-center cursor-pointer"
          >
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white"
              @click="toggleTeamStats('passes')"
            >
              Passes
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white"
              @click="toggleTeamStats('tackles')"
            >
              Tackles
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white"
              @click="toggleTeamStats('corners')"
            >
              Corners
            </div>
            <!-- <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white"
            >
              1st Half Corners
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white"
            >
              2nd Half Corners
            </div> -->
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white"
              @click="toggleTeamStats('shotsTotal')"
            >
              Shots - Total
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white"
              @click="toggleTeamStats('shotsOnTarget')"
            >
              Shots - On Target
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white"
              @click="toggleTeamStats('shotsOffTarget')"
            >
              Shots - Off Target
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white"
              @click="toggleTeamStats('ShotsOutsideBox')"
            >
              Shots - Outside Box
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white"
              @click="toggleTeamStats('ShotsInsideBox')"
            >
              Shots - Inside Box
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white"
              @click="toggleTeamStats('offside')"
            >
              Offsides
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white"
              @click="toggleTeamStats('yellowCard')"
            >
              Yellow Cards
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white"
              @click="toggleTeamStats('redCard')"
            >
              Red Cards
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white"
              @click="toggleTeamStats('penalties')"
            >
              Penalties
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white"
              @click="toggleTeamStats('throwIns')"
            >
              Throw Ins
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white"
              @click="toggleTeamStats('freeKicks')"
            >
              Free Kicks
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white"
              @click="toggleTeamStats('goalKicks')"
            >
              Goal Kicks
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white"
              @click="toggleTeamStats('saves')"
            >
              Saves
            </div>
          </div>
        </div>
      </div>
      <!-- tabs section -->

      <!-- checkbox section -->
      <div class="mt-4 md:mt-7">
        <div class="mb-4">
          <h5
            class="text-gray-600 font-bold text-xs uppercase mr-5 w-32 mb-2 2xl:mb-0"
          >
            Competitions
          </h5>
          <div class="grid grid-cols-2 gap-2 md:grid-cols-5 lg:grid-cols-7">
            <div class="flex items-center pr-4 mb-1 2xl:mb-0">
              <input
                id="leagueCheck1"
                name="leagueCheck1"
                type="checkbox"
                class="h-4 w-4 border-gray-300 rounded league-filter"
                data-league-id="30"
              />
              <label
                for="leagueCheck1"
                class="ml-2 block text-sm text-gray-700"
              >
                Premier League
              </label>
            </div>
            <div class="flex items-center pr-4 mb-1 2xl:mb-0">
              <input
                id="leagueCheck2"
                name="leagueCheck2"
                type="checkbox"
                class="h-4 w-4 border-gray-300 rounded league-filter"
                data-league-id="30"
              />
              <label
                for="leagueCheck2"
                class="ml-2 block text-sm text-gray-700"
              >
                FA Cup
              </label>
            </div>
            <div class="flex items-center pr-4 mb-1 2xl:mb-0">
              <input
                id="leagueCheck3"
                name="leagueCheck3"
                type="checkbox"
                class="h-4 w-4 border-gray-300 rounded league-filter"
                data-league-id="31"
              />
              <label
                for="leagueCheck3"
                class="ml-2 block text-sm text-gray-700"
              >
                Carabao Cup
              </label>
            </div>
            <div class="flex items-center pr-4 mb-1 2xl:mb-0">
              <input
                id="leagueCheck4"
                name="leagueCheck4"
                type="checkbox"
                class="h-4 w-4 border-gray-300 rounded league-filter"
                data-league-id="27"
              />
              <label
                for="leagueCheck4"
                class="ml-2 block text-sm text-gray-700"
              >
                Champions League
              </label>
            </div>
            <div class="flex items-center pr-4 mb-1 2xl:mb-0">
              <input
                id="leagueCheck5"
                name="leagueCheck5"
                type="checkbox"
                class="h-4 w-4 border-gray-300 rounded league-filter"
                data-league-id="29"
              />
              <label
                for="leagueCheck5"
                class="ml-2 block text-sm text-gray-700"
              >
                Community Shield
              </label>
            </div>
            <div class="flex items-center pr-4 mb-1 2xl:mb-0">
              <input
                id="leagueCheck5"
                name="leagueCheck5"
                type="checkbox"
                class="h-4 w-4 border-gray-300 rounded league-filter"
                data-league-id="29"
              />
              <label
                for="leagueCheck5"
                class="ml-2 block text-sm text-gray-700"
              >
                Next Opponent
              </label>
            </div>
          </div>
        </div>
        <div class="">
          <h5
            class="text-gray-600 font-bold text-xs uppercase mr-5 w-32 mb-2 2xl:mb-0"
          >
            Venue
          </h5>
          <div class="grid grid-cols-2 gap-2 md:grid-cols-5 lg:grid-cols-7">
            <div class="flex items-center pr-4 mb-1 2xl:mb-0">
              <input
                id="venueCheck1"
                name="venueCheck1"
                type="checkbox"
                class="h-4 w-4 border-gray-300 rounded venue-filter"
                data-venue-id="h"
              />
              <label for="venueCheck1" class="ml-2 block text-sm text-gray-700">
                Home
              </label>
            </div>
            <div class="flex items-center pr-4 mb-1 2xl:mb-0">
              <input
                id="venueCheck2"
                name="venueCheck2"
                type="checkbox"
                class="h-4 w-4 border-gray-300 rounded venue-filter"
                data-venue-id="a"
              />
              <label for="venueCheck2" class="ml-2 block text-sm text-gray-700">
                Away
              </label>
            </div>
          </div>
        </div>
      </div>
      <!-- checkbox section -->
      <div class="overflow-x-scroll pb-16 text-xs">
        <div class="relative border rounded mt-8 w-[5700px]">
          <div v-if="players && showStats === 'player'">
            <div class="bg-[#0d406a] text-white p-5 text-3xl mb-5 capitalize">
              {{ team.data.name }} Players
            </div>
            <div class="flex relative">
              <div class="w-44 border"></div>

              <div
                class="data-cell relative p-1"
                v-for="index in 30"
                :key="index"
              >
                <img
                  src="https://cdn.sportmonks.com/images/soccer/teams/8/8.png"
                  class="w-6 md:w-7"
                  alt=""
                />
                <span
                  class="absolute bottom-0 right-1 text-[0.6rem] font-medium"
                  >H</span
                >
              </div>
            </div>

            <div class="flex relative" v-for="p in players.data">
              <div class="w-44 border">
                <div class="flex align-middle">
                  <img
                    :src="p.player.data.image_path"
                    class="h-8 p-1 mr-1 hidden md:inline-flex"
                    alt=""
                  />
                  <span class="self-center pl-1">{{
                    p.player.data.display_name
                  }}</span>
                </div>
              </div>

              <div
                class="data-cell relative p-1 font-bold"
                v-for="index in 30"
                :key="index"
              >
                45%
              </div>
            </div>
          </div>

          <div class="mt-5" v-if="allStats && showStats === 'team'">
            <div
              class="bg-[#0d406a] text-white p-5 text-3xl mb-5 capitalize"
              v-if="team"
            >
              {{ team.data.name }} Stats
            </div>

            <div class="flex relative">
              <div class="w-44 border p-1">Leagues</div>

              <div
                class="data-cell p-1 cursor-pointer tooltip"
                v-for="l in allStats.data"
                :key="l"
              >
                <span class="tooltiptext">{{ l.league.data.name }}</span>
                <img :src="l.league.data.logo_path" class="w-4 md:w-5" alt="" />
              </div>
            </div>

            <div class="flex relative">
              <div class="w-44 border p-1">Against</div>

              <div class="data-cell p-1" v-for="l in allStats.data" :key="l">
                <span
                  class="cursor-pointer tooltip"
                  v-if="l.visitorteam_id !== teamId"
                  @click="goto(l.visitorteam_id)"
                >
                  <span class="tooltiptext">{{ l.visitorTeam.data.name }}</span>
                  <img :src="l.visitorTeam.data.logo_path" class="w-4 md:w-5" />
                </span>
                <span
                  class="cursor-pointer tooltip"
                  v-if="l.localteam_id !== teamId"
                  @click="goto(l.localteam_id)"
                >
                  <span class="tooltiptext">{{ l.localTeam.data.name }}</span>
                  <img :src="l.localTeam.data.logo_path" class="w-4 md:w-5" />
                </span>
              </div>
            </div>

            <div>
              <div
                class="flex relative"
                v-if="showValue === 'passes' || showValue === ''"
              >
                <div class="w-44 border p-1 font-bold">Passes</div>
                <div
                  class="data-cell p-1"
                  v-for="stat in allStats.data"
                  :key="stat"
                >
                  <span v-for="s in stat.stats.data" :key="s">
                    <span v-if="s.team_id === teamId" class="font-bold">
                      {{ s.passes.total }}
                    </span>
                  </span>
                </div>
              </div>

              <div
                class="flex relative"
                v-if="showValue === 'tackles' || showValue === ''"
              >
                <div class="w-44 border p-1 font-bold">Tackles</div>
                <div
                  class="data-cell p-1"
                  v-for="stat in allStats.data"
                  :key="stat"
                >
                  <span v-for="s in stat.stats.data" :key="s">
                    <span v-if="s.team_id === teamId" class="font-bold">
                      {{ s.tackles }}
                    </span>
                  </span>
                </div>
              </div>

              <div
                class="flex relative"
                v-if="showValue === 'corners' || showValue === ''"
              >
                <div class="w-44 border p-1 font-bold">Corners</div>
                <div
                  class="data-cell p-1"
                  v-for="stat in allStats.data"
                  :key="stat"
                >
                  <span v-for="s in stat.stats.data" :key="s">
                    <span v-if="s.team_id === teamId" class="font-bold">
                      {{ s.corners }}
                    </span>
                  </span>
                </div>
              </div>

              <div
                class="flex relative"
                v-if="showValue === 'shotsTotal' || showValue === ''"
              >
                <div class="w-44 border p-1 font-bold">Shots - Total</div>
                <div
                  class="data-cell p-1"
                  v-for="stat in allStats.data"
                  :key="stat"
                >
                  <span v-for="s in stat.stats.data" :key="s">
                    <span v-if="s.team_id === teamId" class="font-bold">
                      {{ s.shots.total }}
                    </span>
                  </span>
                </div>
              </div>

              <div
                class="flex relative"
                v-if="showValue === 'shotsOnTarget' || showValue === ''"
              >
                <div class="w-44 border p-1 font-bold">Shots - On target</div>
                <div
                  class="data-cell p-1"
                  v-for="stat in allStats.data"
                  :key="stat"
                >
                  <span v-for="s in stat.stats.data" :key="s">
                    <span v-if="s.team_id === teamId" class="font-bold">
                      {{ s.shots.ongoal }}
                    </span>
                  </span>
                </div>
              </div>

              <div
                class="flex relative"
                v-if="showValue === 'shotsOffTarget' || showValue === ''"
              >
                <div class="w-44 border p-1 font-bold">Shots - Off target</div>
                <div
                  class="data-cell p-1"
                  v-for="stat in allStats.data"
                  :key="stat"
                >
                  <span v-for="s in stat.stats.data" :key="s">
                    <span v-if="s.team_id === teamId" class="font-bold">
                      {{ s.shots.offgoal }}
                    </span>
                  </span>
                </div>
              </div>

              <div
                class="flex relative"
                v-if="showValue === 'ShotsInsideBox' || showValue === ''"
              >
                <div class="w-44 border p-1 font-bold">Shots - Inside Box</div>
                <div
                  class="data-cell p-1"
                  v-for="stat in allStats.data"
                  :key="stat"
                >
                  <span v-for="s in stat.stats.data" :key="s">
                    <span v-if="s.team_id === teamId" class="font-bold">
                      {{ s.shots.insidebox }}
                    </span>
                  </span>
                </div>
              </div>

              <div
                class="flex relative"
                v-if="showValue === 'ShotsOutsideBox' || showValue === ''"
              >
                <div class="w-44 border p-1 font-bold">Shots - Outside Box</div>
                <div
                  class="data-cell p-1"
                  v-for="stat in allStats.data"
                  :key="stat"
                >
                  <span v-for="s in stat.stats.data" :key="s">
                    <span v-if="s.team_id === teamId" class="font-bold">
                      {{ s.shots.outsidebox }}
                    </span>
                  </span>
                </div>
              </div>

              <div
                class="flex relative"
                v-if="showValue === 'fouls' || showValue === ''"
              >
                <div class="w-44 border p-1 font-bold">Fouls</div>
                <div
                  class="data-cell p-1"
                  v-for="stat in allStats.data"
                  :key="stat"
                >
                  <span v-for="s in stat.stats.data" :key="s">
                    <span v-if="s.team_id === teamId" class="font-bold">
                      {{ s.fouls }}
                    </span>
                  </span>
                </div>
              </div>

              <div
                class="flex relative"
                v-if="showValue === 'offside' || showValue === ''"
              >
                <div class="w-44 border p-1 font-bold">Offside</div>
                <div
                  class="data-cell p-1"
                  v-for="stat in allStats.data"
                  :key="stat"
                >
                  <span v-for="s in stat.stats.data" :key="s">
                    <span v-if="s.team_id === teamId" class="font-bold">
                      {{ s.offsides }}
                    </span>
                  </span>
                </div>
              </div>

              <div
                class="flex relative"
                v-if="showValue === 'yellowCard' || showValue === ''"
              >
                <div class="w-44 border p-1 font-bold">Yellow Cards</div>
                <div
                  class="data-cell p-1"
                  v-for="stat in allStats.data"
                  :key="stat"
                >
                  <span v-for="s in stat.stats.data" :key="s">
                    <span v-if="s.team_id === teamId" class="font-bold">
                      {{ s.yellowcards }}
                    </span>
                  </span>
                </div>
              </div>

              <div
                class="flex relative"
                v-if="showValue === 'redCard' || showValue === ''"
              >
                <div class="w-44 border p-1 font-bold">Red Cards</div>
                <div
                  class="data-cell p-1"
                  v-for="stat in allStats.data"
                  :key="stat"
                >
                  <span v-for="s in stat.stats.data" :key="s">
                    <span v-if="s.team_id === teamId" class="font-bold">
                      {{ s.redcards }}
                    </span>
                  </span>
                </div>
              </div>

              <div
                class="flex relative"
                v-if="showValue === 'penalties' || showValue === ''"
              >
                <div class="w-44 border p-1 font-bold">Penalties</div>
                <div
                  class="data-cell p-1"
                  v-for="stat in allStats.data"
                  :key="stat"
                >
                  <span v-for="s in stat.stats.data" :key="s">
                    <span v-if="s.team_id === teamId" class="font-bold">
                      {{ s.penalties }}
                    </span>
                  </span>
                </div>
              </div>

              <div
                class="flex relative"
                v-if="showValue === 'throwIns' || showValue === ''"
              >
                <div class="w-44 border p-1 font-bold">Throw-Ins</div>
                <div
                  class="data-cell p-1"
                  v-for="stat in allStats.data"
                  :key="stat"
                >
                  <span v-for="s in stat.stats.data" :key="s">
                    <span v-if="s.team_id === teamId" class="font-bold">
                      {{ s.throw_in }}
                    </span>
                  </span>
                </div>
              </div>

              <div
                class="flex relative"
                v-if="showValue === 'freeKicks' || showValue === ''"
              >
                <div class="w-44 border p-1 font-bold">Free Kicks</div>
                <div
                  class="data-cell p-1"
                  v-for="stat in allStats.data"
                  :key="stat"
                >
                  <span v-for="s in stat.stats.data" :key="s">
                    <span v-if="s.team_id === teamId" class="font-bold">
                      {{ s.free_kick }}
                    </span>
                  </span>
                </div>
              </div>

              <div
                class="flex relative"
                v-if="showValue === 'goalKicks' || showValue === ''"
              >
                <div class="w-44 border p-1 font-bold">Goal Kicks</div>
                <div
                  class="data-cell p-1"
                  v-for="stat in allStats.data"
                  :key="stat"
                >
                  <span v-for="s in stat.stats.data" :key="s">
                    <span v-if="s.team_id === teamId" class="font-bold">
                      {{ s.goal_kick }}
                    </span>
                  </span>
                </div>
              </div>

              <div
                class="flex relative"
                v-if="showValue === 'saves' || showValue === ''"
              >
                <div class="w-44 border p-1 font-bold">Saves</div>
                <div
                  class="data-cell p-1"
                  v-for="stat in allStats.data"
                  :key="stat"
                >
                  <span v-for="s in stat.stats.data" :key="s">
                    <span v-if="s.team_id === teamId" class="font-bold">
                      {{ s.saves }}
                    </span>
                  </span>
                </div>
              </div>

              <!-- <div class="flex relative">
                <div class="w-44 border p-1 font-bold">Saves</div>
                <div
                  class="data-cell p-1"
                  v-for="stat in allStats.data"
                  :key="stat"
                >
                  <span v-for="s in stat.stats.data" :key="s">
                    <span v-if="s.team_id === teamId" class="font-bold">
                      {{ s.saves }}
                    </span>
                  </span>
                </div>
              </div>

              <div class="flex relative">
                <div class="w-44 border p-1 font-bold">Saves</div>
                <div
                  class="data-cell p-1"
                  v-for="stat in allStats.data"
                  :key="stat"
                >
                  <span v-for="s in stat.stats.data" :key="s">
                    <span v-if="s.team_id === teamId" class="font-bold">
                      {{ s.saves }}
                    </span>
                  </span>
                </div>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.test-bg {
  background-color: #aed5f5;
}

.stat-btn {
  padding-bottom: 0.25rem;
  padding-top: 0.25rem;
  border: 1px solid #0d406a;
  background-color: #ffffff;
  color: #0d406a;
  text-align: center;
}

.stat-btn--opp {
  padding-bottom: 0.25rem;
  padding-top: 0.25rem;
  border: 1px solid #ff0000;
  background-color: #ffffff;
  color: #ff0000;
  text-align: center;
}

.stat {
  border-bottom: 1px solid #ebebeb;
  display: flex;
  position: relative;
}

.stat-btn:hover {
  padding-bottom: 0.25rem;
  padding-top: 0.25rem;
  border: 1px solid #0d406a;
  background-color: #0d406a;
  color: #fff;
  text-align: center;
}

.stat-btn--opp:hover {
  padding-bottom: 0.25rem;
  padding-top: 0.25rem;
  border: 1px solid #ff0000;
  background-color: #ff0000;
  color: #ffffff;
  text-align: center;
}

.stat {
  border-bottom: 1px solid #ebebeb;
  display: flex;
  position: relative;
}

.data-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem !important;
  border: 0.5px solid rgba(0, 0, 0, 0.1);
}

/* Basic styling */
[type="checkbox"] {
  width: 1rem;
  height: 1rem;
  color: #0d406a;
  vertical-align: middle;
  -webkit-appearance: none;
  background: none;
  border: 0;
  outline: 0;
  flex-grow: 0;
  border-radius: 4px;
  background-color: #ffffff;
  transition: background 300ms;
  cursor: pointer;
}

/* Pseudo element for check styling */

[type="checkbox"]::before {
  content: "";
  color: transparent;
  display: block;
  width: inherit;
  height: inherit;
  border-radius: inherit;
  border: 0;
  background-color: transparent;
  background-size: contain;
  box-shadow: inset 0 0 0 1px #ccd3d8;
}

/* Checked */

[type="checkbox"]:checked {
  background-color: currentcolor;
}

[type="checkbox"]:checked::before {
  box-shadow: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E %3Cpath d='M15.88 8.29L10 14.17l-1.88-1.88a.996.996 0 1 0-1.41 1.41l2.59 2.59c.39.39 1.02.39 1.41 0L17.3 9.7a.996.996 0 0 0 0-1.41c-.39-.39-1.03-.39-1.42 0z' fill='%23fff'/%3E %3C/svg%3E");
}

/* Disabled */

[type="checkbox"]:disabled {
  background-color: #ccd3d8;
  opacity: 0.84;
  cursor: not-allowed;
}

/* IE */

[type="checkbox"]::-ms-check {
  content: "";
  color: transparent;
  display: block;
  width: inherit;
  height: inherit;
  border-radius: inherit;
  border: 0;
  background-color: transparent;
  background-size: contain;
  box-shadow: inset 0 0 0 1px #ccd3d8;
}

[type="checkbox"]:checked::-ms-check {
  box-shadow: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E %3Cpath d='M15.88 8.29L10 14.17l-1.88-1.88a.996.996 0 1 0-1.41 1.41l2.59 2.59c.39.39 1.02.39 1.41 0L17.3 9.7a.996.996 0 0 0 0-1.41c-.39-.39-1.03-.39-1.42 0z' fill='%23fff'/%3E %3C/svg%3E");
}

/* tooltip css */
.tooltip {
  position: relative;
  /* display: inline-block; */
  /* border-bottom: 1px dotted black; */
}

.tooltip .tooltiptext {
  visibility: hidden;
  /* width: 120px; */
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 2px;
  padding: 5px 3px;
  position: absolute;
  z-index: 1;
  top: 125%;
  left: 50%;
  margin-left: -60px;
  opacity: 0;
  transition: opacity 0.3s;
}

/* .tooltip .tooltiptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
} */

.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}
</style>

<!-- <div class="flex relative" v-if="showMe === 'passes' && showValue">
  <div class="w-44 border p-1">Passes</div>
  <div
    class="data-cell p-1"
    v-for="stat in allStats.data"
    :key="stat"
  >
    <span v-for="s in stat.stats.data" :key="s">
      <span v-if="s.team_id === teamId" class="font-bold">
        {{ s.passes.total }}
      </span>
    </span>
  </div>
</div> -->
