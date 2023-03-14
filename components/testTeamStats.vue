<script setup>
const route = useRoute();
const teamId = parseInt(route.params.id);
let tab_id = ref("A");
const showRow = ref(false);
const showValue = ref("");
const showStats = ref("player");
const teamSeasonPlayersData = ref([]);

const newTeamStats = ref({});
const newTeamFixtures = ref({});
const newTeamFixturesidListString = ref("");

const playerStats = ref("interception");

const todayDate = ref("");
const months6Before = ref("");
const leaguesList = ref([]);

const showHome = ref(true);
const showAway = ref(true);

const selectedLeague = ref([]);

const lineupPlayers = ref([]);
const benchPlayers = ref([]);
const allPlayers = ref([]);

let today = new Date();

const getDate = function (date) {
  let dd = String(date.getDate() - 1).padStart(2, "0");
  let mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
  let yyyy = date.getFullYear();

  return yyyy + "-" + mm + "-" + dd;
};
const subtract6Months = function (date) {
  date.setMonth(date.getMonth() - 11);
  return date;
};
months6Before.value = getDate(subtract6Months(new Date()));
todayDate.value = getDate(today);

const team = ref({});

onBeforeMount(async () => {
  // new work
  team.value = await useFetch(
    () =>
      `https://soccer.sportmonks.com/api/v2.0/teams/${teamId}?api_token=yJa5UcHQ0V22MXG9wlpQ3vtf8ucr6GzJJdd0IShA2j5wOSatggY783JolO6J`
  );
  newTeamStats.value = await useFetch(
    () =>
      `https://soccer.sportmonks.com/api/v2.0/fixtures/between/2023-03-01/${todayDate.value}/${teamId}?api_token=yJa5UcHQ0V22MXG9wlpQ3vtf8ucr6GzJJdd0IShA2j5wOSatggY783JolO6J&include=stats,league,lineup.player,bench.player,localTeam,visitorTeam`
  );
  if (newTeamStats.value.data) {
    newTeamStats.value.data.data.sort(
      (a, b) =>
        new Date(b.time.starting_at.date) - new Date(a.time.starting_at.date)
    );

    newTeamStats.value.data.data.map((e) => {
      e.lineup.data.map((p) => {
        if (p.team_id === teamId) {
          lineupPlayers.value.push(p);
        }
      });
      e.bench.data.map((p) => {
        if (p.team_id === teamId) {
          benchPlayers.value.push(p);
        }
      });
    });

    allPlayers.value = [...lineupPlayers.value, ...benchPlayers.value];
    console.log("lineup playsers of team", allPlayers.value);
  }

  //   for league filters
  if (newTeamStats.value.data) {
    const listOfleagueIds = newTeamStats.value.data.data.map(
      (match) => match.league_id
    );
    const uniqueIds = [...new Set(listOfleagueIds)];
    selectedLeague.value = [...new Set(listOfleagueIds)];
    leaguesList.value = await Promise.all(
      uniqueIds.map(async (id) => {
        const response = await useFetch(
          `https://soccer.sportmonks.com/api/v2.0/leagues/${id}?api_token=yJa5UcHQ0V22MXG9wlpQ3vtf8ucr6GzJJdd0IShA2j5wOSatggY783JolO6J`
        );
        return response;
      })
    );
  }
  // new work
});

const changeTabs = (tab, section) => {
  tab_id.value = tab;
  if (tab === "A") {
    showPlayerStats("interception");
  }

  if (tab === "B") {
    showPlayerStats("foul_drawn");
  }
  showValue.value = "";
  showRow.value = true;
  showStats.value = section;
};

const toggleTeamStats = (value) => {
  showValue.value = value;
  showRow.value = true;
};

const showPlayerStats = function (value) {
  playerStats.value = value;
};

const goto = function (team) {
  navigateTo(`/teamStats-${team}`);
};

const goPlayerStats = function (p_id) {
  navigateTo(`/player-${p_id}`);
};

const switchVenue = (value) => {
  if (value === "home") {
    showHome.value = !showHome.value;
    console.log("home called");
  }
  if (value === "away") {
    showAway.value = !showAway.value;
    console.log("away called");
  }
};
</script>
<template>
  <div class="w-11/12 md:w-4/5 mx-auto py-8">
    <div class="flex justify-start text-gray-600">
      <a href="/" class="flex self-center mr-3"
        ><img src="@/assets/home.png" alt="" class="opacity-50"
      /></a>
      <span class="mr-3 self-center">
        <img src="@/assets/right.png" class="opacity-50" alt="" />
      </span>
      <a href="/" class="self-center">Premier League</a>
    </div>
    <div class="min-w-0 w-full flex-auto lg:static lg:max-h-full">
      <div class="mt-4 md:mt-4 border rounded-md p-2 mb-5">
        <div class="grid md:grid-cols-2">
          <div class="flex justify-start" v-if="team.data">
            <img
              :src="team.data.data.logo_path"
              class="self-center w-12 md:w-16 mr-3"
              alt=""
            />
            <h1
              class="inline-block text-xl md:text-2xl self-center font-medium text-gray-900 tracking-tight capitalize"
            >
              {{ team.data.data.name }}
            </h1>
          </div>
        </div>
      </div>

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
            class="grid gap-1 text-sm grid-cols-2 md:grid-cols-4 lg:grid-cols-6 justify-between items-center"
          >
            <div
              class="p-1 border text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white hover:cursor-pointer"
              :class="[
                playerStats === 'interception'
                  ? 'bg-[#0d406a] text-white font-medium'
                  : 'bg-white',
              ]"
              @click="showPlayerStats('interception')"
            >
              Interceptions
            </div>
            <div
              class="p-1 border text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white hover:cursor-pointer"
              :class="[
                playerStats === 'tackles'
                  ? 'bg-[#0d406a] text-white font-medium'
                  : 'bg-white',
              ]"
              @click="showPlayerStats('tackles')"
            >
              Tackles
            </div>
            <div
              class="p-1 border text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white hover:cursor-pointer"
              :class="[
                playerStats === 'blocks'
                  ? 'bg-[#0d406a] text-white font-medium'
                  : 'bg-white',
              ]"
              @click="showPlayerStats('blocks')"
            >
              Blocks
            </div>
            <div
              class="p-1 border text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white hover:cursor-pointer"
              :class="[
                playerStats === 'total_duels'
                  ? 'bg-[#0d406a] text-white font-medium'
                  : 'bg-white',
              ]"
              @click="showPlayerStats('total_duels')"
            >
              Total Duels
            </div>
            <div
              class="p-1 border text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white hover:cursor-pointer"
              :class="[
                playerStats === 'duel_won'
                  ? 'bg-[#0d406a] text-white font-medium'
                  : 'bg-white',
              ]"
              @click="showPlayerStats('duel_won')"
            >
              Duels Won
            </div>
            <div
              class="p-1 border text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white hover:cursor-pointer"
              :class="[
                playerStats === 'foul_committed'
                  ? 'bg-[#0d406a] text-white font-medium'
                  : 'bg-white',
              ]"
              @click="showPlayerStats('foul_committed')"
            >
              Fouls Committed
            </div>
            <div
              class="p-1 border text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white hover:cursor-pointer"
              :class="[
                playerStats === 'pen_saved'
                  ? 'bg-[#0d406a] text-white font-medium'
                  : 'bg-white',
              ]"
              @click="showPlayerStats('pen_saved')"
            >
              Penalties Saved
            </div>
            <div
              class="p-1 border text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white hover:cursor-pointer"
              :class="[
                playerStats === 'drib_past'
                  ? 'bg-[#0d406a] text-white font-medium'
                  : 'bg-white',
              ]"
              @click="showPlayerStats('drib_past')"
            >
              Dribbled Past
            </div>
            <div
              class="p-1 border text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white hover:cursor-pointer"
              :class="[
                playerStats === 'pen_committed'
                  ? 'bg-[#0d406a] text-white font-medium'
                  : 'bg-white',
              ]"
              @click="showPlayerStats('pen_committed')"
            >
              Penalties Committed
            </div>
            <div
              class="p-1 border text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white hover:cursor-pointer"
              :class="[
                playerStats === 'yellow_card'
                  ? 'bg-[#0d406a] text-white font-medium'
                  : 'bg-white',
              ]"
              @click="showPlayerStats('yellow_card')"
            >
              Yellows
            </div>
            <div
              class="p-1 border text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white hover:cursor-pointer"
              :class="[
                playerStats === 'red_card'
                  ? 'bg-[#0d406a] text-white font-medium'
                  : 'bg-white',
              ]"
              @click="showPlayerStats('red_card')"
            >
              Reds
            </div>
          </div>
        </div>
        <div v-if="tab_id === 'B'">
          <div
            class="grid gap-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-6 justify-between items-center"
          >
            <div
              class="p-1 border text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white hover:cursor-pointer"
              :class="[
                playerStats === 'foul_drawn'
                  ? 'bg-[#0d406a] text-white font-medium'
                  : 'bg-white',
              ]"
              @click="showPlayerStats('foul_drawn')"
            >
              Fouls Drawn
            </div>
            <div
              class="p-1 border text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white hover:cursor-pointer"
              :class="[
                playerStats === 'pen_won'
                  ? 'bg-[#0d406a] text-white font-medium'
                  : 'bg-white',
              ]"
              @click="showPlayerStats('pen_won')"
            >
              Penalties Won
            </div>
            <div
              class="p-1 border text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white hover:cursor-pointer"
              :class="[
                playerStats === 'key_passes'
                  ? 'bg-[#0d406a] text-white font-medium'
                  : 'bg-white',
              ]"
              @click="showPlayerStats('key_passes')"
            >
              Key Passes
            </div>
            <div
              class="p-1 border text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white hover:cursor-pointer"
              :class="[
                playerStats === 'passes'
                  ? 'bg-[#0d406a] text-white font-medium'
                  : 'bg-white',
              ]"
              @click="showPlayerStats('passes')"
            >
              Total Passes
            </div>
            <div
              class="p-1 border text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white hover:cursor-pointer"
              :class="[
                playerStats === 'pen_scored'
                  ? 'bg-[#0d406a] text-white font-medium'
                  : 'bg-white',
              ]"
              @click="showPlayerStats('pen_scored')"
            >
              Penalties Scored
            </div>
            <div
              class="p-1 border text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white hover:cursor-pointer"
              :class="[
                playerStats === 'pen_missed'
                  ? 'bg-[#0d406a] text-white font-medium'
                  : 'bg-white',
              ]"
              @click="showPlayerStats('pen_missed')"
            >
              Penalties Missed
            </div>
            <div
              class="p-1 border text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white hover:cursor-pointer"
              :class="[
                playerStats === 'shots_total'
                  ? 'bg-[#0d406a] text-white font-medium'
                  : 'bg-white',
              ]"
              @click="showPlayerStats('shots_total')"
            >
              Total Shots
            </div>
            <div
              class="p-1 border text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white hover:cursor-pointer"
              :class="[
                playerStats === 'shots_on_goal'
                  ? 'bg-[#0d406a] text-white font-medium'
                  : 'bg-white',
              ]"
              @click="showPlayerStats('shots_on_goal')"
            >
              Shots On target
            </div>
            <div
              class="p-1 border text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white hover:cursor-pointer"
              :class="[
                playerStats === 'offsides'
                  ? 'bg-[#0d406a] text-white font-medium'
                  : 'bg-white',
              ]"
              @click="showPlayerStats('offsides')"
            >
              Offside
            </div>
            <div
              class="p-1 border text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white hover:cursor-pointer"
              :class="[
                playerStats === 'hit_post'
                  ? 'bg-[#0d406a] text-white font-medium'
                  : 'bg-white',
              ]"
              @click="showPlayerStats('hit_post')"
            >
              Hit Post
            </div>
          </div>
        </div>
        <div v-if="tab_id === 'C'">
          <div
            class="grid gap-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-6 justify-between items-center cursor-pointer"
          >
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white hover:cursor-pointer"
              @click="toggleTeamStats('passes')"
            >
              Passes
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white hover:cursor-pointer"
              @click="toggleTeamStats('tackles')"
            >
              Tackles
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white hover:cursor-pointer"
              @click="toggleTeamStats('corners')"
            >
              Corners
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white hover:cursor-pointer"
              @click="toggleTeamStats('shotsTotal')"
            >
              Shots - Total
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white hover:cursor-pointer"
              @click="toggleTeamStats('shotsOnTarget')"
            >
              Shots - On Target
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white hover:cursor-pointer"
              @click="toggleTeamStats('shotsOffTarget')"
            >
              Shots - Off Target
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white hover:cursor-pointer"
              @click="toggleTeamStats('ShotsOutsideBox')"
            >
              Shots - Outside Box
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white hover:cursor-pointer"
              @click="toggleTeamStats('ShotsInsideBox')"
            >
              Shots - Inside Box
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white hover:cursor-pointer"
              @click="toggleTeamStats('offside')"
            >
              Offsides
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white hover:cursor-pointer"
              @click="toggleTeamStats('yellowCard')"
            >
              Yellow Cards
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white hover:cursor-pointer"
              @click="toggleTeamStats('redCard')"
            >
              Red Cards
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white hover:cursor-pointer"
              @click="toggleTeamStats('penalties')"
            >
              Penalties
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white hover:cursor-pointer"
              @click="toggleTeamStats('throwIns')"
            >
              Throw Ins
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white hover:cursor-pointer"
              @click="toggleTeamStats('freeKicks')"
            >
              Free Kicks
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white hover:cursor-pointer"
              @click="toggleTeamStats('goalKicks')"
            >
              Goal Kicks
            </div>
            <div
              class="p-1 border bg-white text-center text-sm border-[#0d406a] hover:bg-[#0d406a] hover:text-white hover:cursor-pointer"
              @click="toggleTeamStats('saves')"
            >
              Saves
            </div>
          </div>
        </div>
      </div>

      <div class="mt-4 md:mt-7">
        <div class="mb-4">
          <h5
            class="text-gray-600 font-bold text-xs uppercase mr-5 w-32 mb-2 2xl:mb-0"
          >
            Competitions
          </h5>
          <div
            class="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-6"
            v-if="leaguesList"
          >
            <div
              class="flex items-center pr-4 mb-1 2xl:mb-0"
              v-for="league of leaguesList"
            >
              <input
                :id="league.data.data.id"
                :name="league.data.data.id"
                type="checkbox"
                class="h-4 w-4 border-gray-300 rounded league-filter"
                :checked="true"
                :value="league.data.data.id"
                v-model="selectedLeague"
              />
              <label
                :for="league.data.data.id"
                class="ml-2 block text-sm text-gray-700"
              >
                {{ league.data.data.name }}
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
          <div class="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-6">
            <div class="flex items-center pr-4 mb-1 2xl:mb-0">
              <input
                id="venueCheck1"
                name="venueCheck1"
                type="checkbox"
                class="h-4 w-4 border-gray-300 rounded venue-filter"
                data-venue-id="h"
                :checked="showHome"
                @change="switchVenue('home')"
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
                :checked="showAway"
                @change="switchVenue('away')"
              />
              <label for="venueCheck2" class="ml-2 block text-sm text-gray-700">
                Away
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="pb-16 text-xs overflow-x-auto overflow-visible">
        <div
          class="relative border rounded mt-8 w-[6700px]"
          v-if="newTeamStats.data"
        >
          <div v-if="showStats === 'player'">
            <div class="flex relative">
              <span v-for="team in newTeamStats.data.data">
                <div
                  class="flex"
                  v-if="
                    selectedLeague.includes(team.league_id) &&
                    (team.localteam_id === teamId ? showHome : showAway)
                  "
                >
                  <div class="w-44 text-center self-center font-bold">
                    Opposition
                  </div>
                  <div
                    class="data-cell-img relative p-1"
                    v-if="teamId === team.localteam_id"
                    @click="goto(team.visitorteam_id)"
                  >
                    <img
                      :src="team.visitorTeam.data.logo_path"
                      class="w-6 md:w-7"
                      alt=""
                    />
                    <span
                      class="absolute bottom-0 right-1 text-[0.6rem] font-medium"
                      >H</span
                    >
                  </div>
                  <div
                    class="data-cell-img relative p-1"
                    v-if="teamId === team.visitorteam_id"
                    @click="goto(team.localteam_id)"
                  >
                    <img
                      :src="team.localTeam.data.logo_path"
                      class="w-6 md:w-7"
                      alt=""
                    />
                    <span
                      class="absolute bottom-0 right-1 text-[0.6rem] font-medium"
                      >A</span
                    >
                  </div>
                </div>
                <div
                  class="flex relative"
                  v-for="p in team.lineup.data"
                  v-if="
                    selectedLeague.includes(team.league_id) &&
                    (team.localteam_id === teamId ? showHome : showAway)
                  "
                >
                  <div class="w-44 border" v-if="teamId === p.team_id">
                    <div
                      class="flex align-middle hover:cursor-pointer"
                      @click="goPlayerStats(p.player.data.player_id)"
                    >
                      <img
                        :src="p.player.data.image_path"
                        class="h-8 p-1 mr-1 hidden md:inline-flex"
                        alt=""
                      />
                      <span class="self-center pl-1">{{ p.player_name }}</span>
                    </div>
                  </div>

                  <div class="flex w-100 tooltip">
                    <span
                      v-if="p.stats.other.minutes_played"
                      class="tooltiptext"
                      >infield: {{ p.stats.other.minutes_played }}'</span
                    >
                    <div
                      class="data-cell p-1 font-bold"
                      v-if="
                        teamId === p.team_id && playerStats === 'interception'
                      "
                      :style="[
                        p.stats.other.minutes_played
                          ? {
                              maxWidth:
                                (p.stats.other.minutes_played * 100) / 90 + '%',
                              backgroundColor: 'rgb(144,238,144)',
                            }
                          : {
                              maxWidth: '100%',
                              backgroundColor: 'white',
                            },
                      ]"
                    >
                      <div class="text-center">
                        {{ p.stats.other.interceptions }}
                      </div>
                    </div>
                  </div>

                  <div class="flex w-100 tooltip">
                    <span
                      v-if="p.stats.other.minutes_played"
                      class="tooltiptext"
                      >infield: {{ p.stats.other.minutes_played }}'</span
                    >
                    <div
                      class="data-cell p-1 font-bold"
                      v-if="teamId === p.team_id && playerStats === 'tackles'"
                      :style="[
                        p.stats.other.minutes_played
                          ? {
                              maxWidth:
                                (p.stats.other.minutes_played * 100) / 90 + '%',
                              backgroundColor: 'rgb(144,238,144)',
                            }
                          : {
                              maxWidth: '100%',
                              backgroundColor: 'white',
                            },
                      ]"
                    >
                      <div class="text-center">
                        {{ p.stats.other.tackles }}
                      </div>
                    </div>
                  </div>

                  <div class="flex w-100 tooltip">
                    <span
                      v-if="p.stats.other.minutes_played"
                      class="tooltiptext"
                      >infield: {{ p.stats.other.minutes_played }}'</span
                    >
                    <div
                      class="data-cell p-1 font-bold"
                      v-if="teamId === p.team_id && playerStats === 'blocks'"
                      :style="[
                        p.stats.other.minutes_played
                          ? {
                              maxWidth:
                                (p.stats.other.minutes_played * 100) / 90 + '%',
                              backgroundColor: 'rgb(144,238,144)',
                            }
                          : {
                              maxWidth: '100%',
                              backgroundColor: 'white',
                            },
                      ]"
                    >
                      <div class="text-center">
                        {{ p.stats.other.blocks }}
                      </div>
                    </div>
                  </div>

                  <div class="flex w-100 tooltip">
                    <span
                      v-if="p.stats.other.minutes_played"
                      class="tooltiptext"
                      >infield: {{ p.stats.other.minutes_played }}'</span
                    >
                    <div
                      class="data-cell p-1 font-bold"
                      v-if="
                        teamId === p.team_id && playerStats === 'total_duels'
                      "
                      :style="[
                        p.stats.other.minutes_played
                          ? {
                              maxWidth:
                                (p.stats.other.minutes_played * 100) / 90 + '%',
                              backgroundColor: 'rgb(144,238,144)',
                            }
                          : {
                              maxWidth: '100%',
                              backgroundColor: 'white',
                            },
                      ]"
                    >
                      <div class="text-center">
                        {{ p.stats.duels.total }}
                      </div>
                    </div>
                  </div>

                  <div class="flex w-100 tooltip">
                    <span
                      v-if="p.stats.other.minutes_played"
                      class="tooltiptext"
                      >infield: {{ p.stats.other.minutes_played }}'</span
                    >
                    <div
                      class="data-cell p-1 font-bold"
                      v-if="teamId === p.team_id && playerStats === 'duel_won'"
                      :style="[
                        p.stats.other.minutes_played
                          ? {
                              maxWidth:
                                (p.stats.other.minutes_played * 100) / 90 + '%',
                              backgroundColor: 'rgb(144,238,144)',
                            }
                          : {
                              maxWidth: '100%',
                              backgroundColor: 'white',
                            },
                      ]"
                    >
                      <div class="text-center">
                        {{ p.stats.duels.won }}
                      </div>
                    </div>
                  </div>

                  <div class="flex w-100 tooltip">
                    <span
                      v-if="p.stats.other.minutes_played"
                      class="tooltiptext"
                      >infield: {{ p.stats.other.minutes_played }}'</span
                    >
                    <div
                      class="data-cell p-1 font-bold"
                      v-if="
                        teamId === p.team_id && playerStats === 'foul_committed'
                      "
                      :style="[
                        p.stats.other.minutes_played
                          ? {
                              maxWidth:
                                (p.stats.other.minutes_played * 100) / 90 + '%',
                              backgroundColor: 'rgb(144,238,144)',
                            }
                          : {
                              maxWidth: '100%',
                              backgroundColor: 'white',
                            },
                      ]"
                    >
                      <div class="text-center">
                        {{ p.stats.fouls.committed }}
                      </div>
                    </div>
                  </div>

                  <div class="flex w-100 tooltip">
                    <span
                      v-if="p.stats.other.minutes_played"
                      class="tooltiptext"
                      >infield: {{ p.stats.other.minutes_played }}'</span
                    >
                    <div
                      class="data-cell p-1 font-bold"
                      v-if="teamId === p.team_id && playerStats === 'pen_saved'"
                      :style="[
                        p.stats.other.minutes_played
                          ? {
                              maxWidth:
                                (p.stats.other.minutes_played * 100) / 90 + '%',
                              backgroundColor: 'rgb(144,238,144)',
                            }
                          : {
                              maxWidth: '100%',
                              backgroundColor: 'white',
                            },
                      ]"
                    >
                      <div class="text-center">
                        {{ p.stats.other.pen_saved }}
                      </div>
                    </div>
                  </div>

                  <div class="flex w-100 tooltip">
                    <span
                      v-if="p.stats.other.minutes_played"
                      class="tooltiptext"
                      >infield: {{ p.stats.other.minutes_played }}'</span
                    >
                    <div
                      class="data-cell p-1 font-bold"
                      v-if="teamId === p.team_id && playerStats === 'drib_past'"
                      :style="[
                        p.stats.other.minutes_played
                          ? {
                              maxWidth:
                                (p.stats.other.minutes_played * 100) / 90 + '%',
                              backgroundColor: 'rgb(144,238,144)',
                            }
                          : {
                              maxWidth: '100%',
                              backgroundColor: 'white',
                            },
                      ]"
                    >
                      <div class="text-center">
                        {{ p.stats.dribbles.dribbled_past }}
                      </div>
                    </div>
                  </div>

                  <div class="flex w-100 tooltip">
                    <span
                      v-if="p.stats.other.minutes_played"
                      class="tooltiptext"
                      >infield: {{ p.stats.other.minutes_played }}'</span
                    >
                    <div
                      class="data-cell p-1 font-bold"
                      v-if="
                        teamId === p.team_id && playerStats === 'pen_committed'
                      "
                      :style="[
                        p.stats.other.minutes_played
                          ? {
                              maxWidth:
                                (p.stats.other.minutes_played * 100) / 90 + '%',
                              backgroundColor: 'rgb(144,238,144)',
                            }
                          : {
                              maxWidth: '100%',
                              backgroundColor: 'white',
                            },
                      ]"
                    >
                      <div class="text-center">
                        {{ p.stats.other.pen_committed }}
                      </div>
                    </div>
                  </div>

                  <div class="flex w-100 tooltip">
                    <span
                      v-if="p.stats.other.minutes_played"
                      class="tooltiptext"
                      >infield: {{ p.stats.other.minutes_played }}'</span
                    >
                    <div
                      class="data-cell p-1 font-bold"
                      v-if="
                        teamId === p.team_id && playerStats === 'yellow_card'
                      "
                      :style="[
                        p.stats.other.minutes_played
                          ? {
                              maxWidth:
                                (p.stats.other.minutes_played * 100) / 90 + '%',
                              backgroundColor: 'rgb(144,238,144)',
                            }
                          : {
                              maxWidth: '100%',
                              backgroundColor: 'white',
                            },
                      ]"
                    >
                      <div class="text-center">
                        {{ p.stats.cards.yellowcards }}
                      </div>
                    </div>
                  </div>

                  <div class="flex w-100 tooltip">
                    <span
                      v-if="p.stats.other.minutes_played"
                      class="tooltiptext"
                      >infield: {{ p.stats.other.minutes_played }}'</span
                    >
                    <div
                      class="data-cell p-1 font-bold"
                      v-if="teamId === p.team_id && playerStats === 'red_card'"
                      :style="[
                        p.stats.other.minutes_played
                          ? {
                              maxWidth:
                                (p.stats.other.minutes_played * 100) / 90 + '%',
                              backgroundColor: 'rgb(144,238,144)',
                            }
                          : {
                              maxWidth: '100%',
                              backgroundColor: 'white',
                            },
                      ]"
                    >
                      <div class="text-center">
                        {{ p.stats.cards.redcards }}
                      </div>
                    </div>
                  </div>

                  <div class="flex w-100 tooltip">
                    <span
                      v-if="p.stats.other.minutes_played"
                      class="tooltiptext"
                      >infield: {{ p.stats.other.minutes_played }}'</span
                    >
                    <div
                      class="data-cell p-1 font-bold"
                      v-if="
                        teamId === p.team_id && playerStats === 'foul_drawn'
                      "
                      :style="[
                        p.stats.other.minutes_played
                          ? {
                              maxWidth:
                                (p.stats.other.minutes_played * 100) / 90 + '%',
                              backgroundColor: 'rgb(144,238,144)',
                            }
                          : {
                              maxWidth: '100%',
                              backgroundColor: 'white',
                            },
                      ]"
                    >
                      <div class="text-center">
                        {{ p.stats.fouls.drawn }}
                      </div>
                    </div>
                  </div>

                  <div class="flex w-100 tooltip">
                    <span
                      v-if="p.stats.other.minutes_played"
                      class="tooltiptext"
                      >infield: {{ p.stats.other.minutes_played }}'</span
                    >
                    <div
                      class="data-cell p-1 font-bold"
                      v-if="teamId === p.team_id && playerStats === 'pen_won'"
                      :style="[
                        p.stats.other.minutes_played
                          ? {
                              maxWidth:
                                (p.stats.other.minutes_played * 100) / 90 + '%',
                              backgroundColor: 'rgb(144,238,144)',
                            }
                          : {
                              maxWidth: '100%',
                              backgroundColor: 'white',
                            },
                      ]"
                    >
                      <div class="text-center">
                        {{ p.stats.other.pen_won }}
                      </div>
                    </div>
                  </div>

                  <div class="flex w-100 tooltip">
                    <span
                      v-if="p.stats.other.minutes_played"
                      class="tooltiptext"
                      >infield: {{ p.stats.other.minutes_played }}'</span
                    >
                    <div
                      class="data-cell p-1 font-bold"
                      v-if="
                        teamId === p.team_id && playerStats === 'key_passes'
                      "
                      :style="[
                        p.stats.other.minutes_played
                          ? {
                              maxWidth:
                                (p.stats.other.minutes_played * 100) / 90 + '%',
                              backgroundColor: 'rgb(144,238,144)',
                            }
                          : {
                              maxWidth: '100%',
                              backgroundColor: 'white',
                            },
                      ]"
                    >
                      <div class="text-center">
                        {{ p.stats.passing.key_passes }}
                      </div>
                    </div>
                  </div>

                  <div class="flex w-100 tooltip">
                    <span
                      v-if="p.stats.other.minutes_played"
                      class="tooltiptext"
                      >infield: {{ p.stats.other.minutes_played }}'</span
                    >
                    <div
                      class="data-cell p-1 font-bold"
                      v-if="teamId === p.team_id && playerStats === 'passes'"
                      :style="[
                        p.stats.other.minutes_played
                          ? {
                              maxWidth:
                                (p.stats.other.minutes_played * 100) / 90 + '%',
                              backgroundColor: 'rgb(144,238,144)',
                            }
                          : {
                              maxWidth: '100%',
                              backgroundColor: 'white',
                            },
                      ]"
                    >
                      <div class="text-center">
                        {{ p.stats.passing.passes }}
                      </div>
                    </div>
                  </div>

                  <div class="flex w-100 tooltip">
                    <span
                      v-if="p.stats.other.minutes_played"
                      class="tooltiptext"
                      >infield: {{ p.stats.other.minutes_played }}'</span
                    >
                    <div
                      class="data-cell p-1 font-bold"
                      v-if="
                        teamId === p.team_id && playerStats === 'pen_scored'
                      "
                      :style="[
                        p.stats.other.minutes_played
                          ? {
                              maxWidth:
                                (p.stats.other.minutes_played * 100) / 90 + '%',
                              backgroundColor: 'rgb(144,238,144)',
                            }
                          : {
                              maxWidth: '100%',
                              backgroundColor: 'white',
                            },
                      ]"
                    >
                      <div class="text-center">
                        {{ p.stats.other.pen_scored }}
                      </div>
                    </div>
                  </div>

                  <div class="flex w-100 tooltip">
                    <span
                      v-if="p.stats.other.minutes_played"
                      class="tooltiptext"
                      >infield: {{ p.stats.other.minutes_played }}'</span
                    >
                    <div
                      class="data-cell p-1 font-bold"
                      v-if="
                        teamId === p.team_id && playerStats === 'pen_missed'
                      "
                      :style="[
                        p.stats.other.minutes_played
                          ? {
                              maxWidth:
                                (p.stats.other.minutes_played * 100) / 90 + '%',
                              backgroundColor: 'rgb(144,238,144)',
                            }
                          : {
                              maxWidth: '100%',
                              backgroundColor: 'white',
                            },
                      ]"
                    >
                      <div class="text-center">
                        {{ p.stats.other.pen_missed }}
                      </div>
                    </div>
                  </div>

                  <div class="flex w-100 tooltip">
                    <span
                      v-if="p.stats.other.minutes_played"
                      class="tooltiptext"
                      >infield: {{ p.stats.other.minutes_played }}'</span
                    >
                    <div
                      class="data-cell p-1 font-bold"
                      v-if="
                        teamId === p.team_id && playerStats === 'shots_total'
                      "
                      :style="[
                        p.stats.other.minutes_played
                          ? {
                              maxWidth:
                                (p.stats.other.minutes_played * 100) / 90 + '%',
                              backgroundColor: 'rgb(144,238,144)',
                            }
                          : {
                              maxWidth: '100%',
                              backgroundColor: 'white',
                            },
                      ]"
                    >
                      <div class="text-center">
                        {{ p.stats.shots.shots_total }}
                      </div>
                    </div>
                  </div>

                  <div class="flex w-100 tooltip">
                    <span
                      v-if="p.stats.other.minutes_played"
                      class="tooltiptext"
                      >infield: {{ p.stats.other.minutes_played }}'</span
                    >
                    <div
                      class="data-cell p-1 font-bold"
                      v-if="
                        teamId === p.team_id && playerStats === 'shots_on_goal'
                      "
                      :style="[
                        p.stats.other.minutes_played
                          ? {
                              maxWidth:
                                (p.stats.other.minutes_played * 100) / 90 + '%',
                              backgroundColor: 'rgb(144,238,144)',
                            }
                          : {
                              maxWidth: '100%',
                              backgroundColor: 'white',
                            },
                      ]"
                    >
                      <div class="text-center">
                        {{ p.stats.shots.shots_on_goal }}
                      </div>
                    </div>
                  </div>

                  <div class="flex w-100 tooltip">
                    <span
                      v-if="p.stats.other.minutes_played"
                      class="tooltiptext"
                      >infield: {{ p.stats.other.minutes_played }}'</span
                    >
                    <div
                      class="data-cell p-1 font-bold"
                      v-if="teamId === p.team_id && playerStats === 'offsides'"
                      :style="[
                        p.stats.other.minutes_played
                          ? {
                              maxWidth:
                                (p.stats.other.minutes_played * 100) / 90 + '%',
                              backgroundColor: 'rgb(144,238,144)',
                            }
                          : {
                              maxWidth: '100%',
                              backgroundColor: 'white',
                            },
                      ]"
                    >
                      <div class="text-center">
                        {{ p.stats.other.offsides }}
                      </div>
                    </div>
                  </div>

                  <div class="flex w-100 tooltip">
                    <span
                      v-if="p.stats.other.minutes_played"
                      class="tooltiptext"
                      >infield: {{ p.stats.other.minutes_played }}'</span
                    >
                    <div
                      class="data-cell p-1 font-bold"
                      v-if="teamId === p.team_id && playerStats === 'hit_post'"
                      :style="[
                        p.stats.other.minutes_played
                          ? {
                              maxWidth:
                                (p.stats.other.minutes_played * 100) / 90 + '%',
                              backgroundColor: 'rgb(144,238,144)',
                            }
                          : {
                              maxWidth: '100%',
                              backgroundColor: 'white',
                            },
                      ]"
                    >
                      <div class="text-center">
                        {{ p.stats.other.hit_woodwork }}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="flex relative"
                  v-for="p in team?.bench.data"
                  v-if="
                    selectedLeague.includes(team.league_id) &&
                    (team.localteam_id === teamId ? showHome : showAway)
                  "
                >
                  <div class="w-44 border" v-if="teamId === p.team_id">
                    <div
                      class="flex align-middle hover:cursor-pointer"
                      @click="goPlayerStats(p.player.data.player_id)"
                    >
                      <img
                        :src="p.player.data.image_path"
                        class="h-8 p-1 mr-1 hidden md:inline-flex"
                        alt=""
                      />
                      <span class="self-center pl-1">{{ p.player_name }}</span>
                    </div>
                  </div>

                  <div class="flex w-100 tooltip">
                    <span
                      v-if="p.stats.other.minutes_played"
                      class="tooltiptext"
                      >infield: {{ p.stats.other.minutes_played }}'</span
                    >
                    <div
                      class="data-cell p-1 font-bold"
                      v-if="
                        teamId === p.team_id && playerStats === 'interception'
                      "
                      :style="[
                        p.stats.other.minutes_played
                          ? {
                              maxWidth:
                                (p.stats.other.minutes_played * 100) / 90 + '%',
                              backgroundColor: 'rgb(144,238,144)',
                            }
                          : {
                              maxWidth: '100%',
                              backgroundColor: 'white',
                            },
                      ]"
                    >
                      <div class="text-center">
                        {{ p.stats.other.interceptions }}
                      </div>
                    </div>
                  </div>

                  <div class="flex w-100 tooltip">
                    <span
                      v-if="p.stats.other.minutes_played"
                      class="tooltiptext"
                      >infield: {{ p.stats.other.minutes_played }}'</span
                    >
                    <div
                      class="data-cell p-1 font-bold"
                      v-if="teamId === p.team_id && playerStats === 'tackles'"
                      :style="[
                        p.stats.other.minutes_played
                          ? {
                              maxWidth:
                                (p.stats.other.minutes_played * 100) / 90 + '%',
                              backgroundColor: 'rgb(144,238,144)',
                            }
                          : {
                              maxWidth: '100%',
                              backgroundColor: 'white',
                            },
                      ]"
                    >
                      <div class="text-center">
                        {{ p.stats.other.tackles }}
                      </div>
                    </div>
                  </div>

                  <div class="flex w-100 tooltip">
                    <span
                      v-if="p.stats.other.minutes_played"
                      class="tooltiptext"
                      >infield: {{ p.stats.other.minutes_played }}'</span
                    >
                    <div
                      class="data-cell p-1 font-bold"
                      v-if="teamId === p.team_id && playerStats === 'blocks'"
                      :style="[
                        p.stats.other.minutes_played
                          ? {
                              maxWidth:
                                (p.stats.other.minutes_played * 100) / 90 + '%',
                              backgroundColor: 'rgb(144,238,144)',
                            }
                          : {
                              maxWidth: '100%',
                              backgroundColor: 'white',
                            },
                      ]"
                    >
                      <div class="text-center">
                        {{ p.stats.other.blocks }}
                      </div>
                    </div>
                  </div>

                  <div class="flex w-100 tooltip">
                    <span
                      v-if="p.stats.other.minutes_played"
                      class="tooltiptext"
                      >infield: {{ p.stats.other.minutes_played }}'</span
                    >
                    <div
                      class="data-cell p-1 font-bold"
                      v-if="
                        teamId === p.team_id && playerStats === 'total_duels'
                      "
                      :style="[
                        p.stats.other.minutes_played
                          ? {
                              maxWidth:
                                (p.stats.other.minutes_played * 100) / 90 + '%',
                              backgroundColor: 'rgb(144,238,144)',
                            }
                          : {
                              maxWidth: '100%',
                              backgroundColor: 'white',
                            },
                      ]"
                    >
                      <div class="text-center">
                        {{ p.stats.duels.total }}
                      </div>
                    </div>
                  </div>

                  <div class="flex w-100 tooltip">
                    <span
                      v-if="p.stats.other.minutes_played"
                      class="tooltiptext"
                      >infield: {{ p.stats.other.minutes_played }}'</span
                    >
                    <div
                      class="data-cell p-1 font-bold"
                      v-if="teamId === p.team_id && playerStats === 'duel_won'"
                      :style="[
                        p.stats.other.minutes_played
                          ? {
                              maxWidth:
                                (p.stats.other.minutes_played * 100) / 90 + '%',
                              backgroundColor: 'rgb(144,238,144)',
                            }
                          : {
                              maxWidth: '100%',
                              backgroundColor: 'white',
                            },
                      ]"
                    >
                      <div class="text-center">
                        {{ p.stats.duels.won }}
                      </div>
                    </div>
                  </div>

                  <div class="flex w-100 tooltip">
                    <span
                      v-if="p.stats.other.minutes_played"
                      class="tooltiptext"
                      >infield: {{ p.stats.other.minutes_played }}'</span
                    >
                    <div
                      class="data-cell p-1 font-bold"
                      v-if="
                        teamId === p.team_id && playerStats === 'foul_committed'
                      "
                      :style="[
                        p.stats.other.minutes_played
                          ? {
                              maxWidth:
                                (p.stats.other.minutes_played * 100) / 90 + '%',
                              backgroundColor: 'rgb(144,238,144)',
                            }
                          : {
                              maxWidth: '100%',
                              backgroundColor: 'white',
                            },
                      ]"
                    >
                      <div class="text-center">
                        {{ p.stats.fouls.committed }}
                      </div>
                    </div>
                  </div>

                  <div class="flex w-100 tooltip">
                    <span
                      v-if="p.stats.other.minutes_played"
                      class="tooltiptext"
                      >infield: {{ p.stats.other.minutes_played }}'</span
                    >
                    <div
                      class="data-cell p-1 font-bold"
                      v-if="teamId === p.team_id && playerStats === 'pen_saved'"
                      :style="[
                        p.stats.other.minutes_played
                          ? {
                              maxWidth:
                                (p.stats.other.minutes_played * 100) / 90 + '%',
                              backgroundColor: 'rgb(144,238,144)',
                            }
                          : {
                              maxWidth: '100%',
                              backgroundColor: 'white',
                            },
                      ]"
                    >
                      <div class="text-center">
                        {{ p.stats.other.pen_saved }}
                      </div>
                    </div>
                  </div>

                  <div class="flex w-100 tooltip">
                    <span
                      v-if="p.stats.other.minutes_played"
                      class="tooltiptext"
                      >infield: {{ p.stats.other.minutes_played }}'</span
                    >
                    <div
                      class="data-cell p-1 font-bold"
                      v-if="teamId === p.team_id && playerStats === 'drib_past'"
                      :style="[
                        p.stats.other.minutes_played
                          ? {
                              maxWidth:
                                (p.stats.other.minutes_played * 100) / 90 + '%',
                              backgroundColor: 'rgb(144,238,144)',
                            }
                          : {
                              maxWidth: '100%',
                              backgroundColor: 'white',
                            },
                      ]"
                    >
                      <div class="text-center">
                        {{ p.stats.dribbles.dribbled_past }}
                      </div>
                    </div>
                  </div>

                  <div class="flex w-100 tooltip">
                    <span
                      v-if="p.stats.other.minutes_played"
                      class="tooltiptext"
                      >infield: {{ p.stats.other.minutes_played }}'</span
                    >
                    <div
                      class="data-cell p-1 font-bold"
                      v-if="
                        teamId === p.team_id && playerStats === 'pen_committed'
                      "
                      :style="[
                        p.stats.other.minutes_played
                          ? {
                              maxWidth:
                                (p.stats.other.minutes_played * 100) / 90 + '%',
                              backgroundColor: 'rgb(144,238,144)',
                            }
                          : {
                              maxWidth: '100%',
                              backgroundColor: 'white',
                            },
                      ]"
                    >
                      <div class="text-center">
                        {{ p.stats.other.pen_committed }}
                      </div>
                    </div>
                  </div>

                  <div class="flex w-100 tooltip">
                    <span
                      v-if="p.stats.other.minutes_played"
                      class="tooltiptext"
                      >infield: {{ p.stats.other.minutes_played }}'</span
                    >
                    <div
                      class="data-cell p-1 font-bold"
                      v-if="
                        teamId === p.team_id && playerStats === 'yellow_card'
                      "
                      :style="[
                        p.stats.other.minutes_played
                          ? {
                              maxWidth:
                                (p.stats.other.minutes_played * 100) / 90 + '%',
                              backgroundColor: 'rgb(144,238,144)',
                            }
                          : {
                              maxWidth: '100%',
                              backgroundColor: 'white',
                            },
                      ]"
                    >
                      <div class="text-center">
                        {{ p.stats.cards.yellowcards }}
                      </div>
                    </div>
                  </div>

                  <div class="flex w-100 tooltip">
                    <span
                      v-if="p.stats.other.minutes_played"
                      class="tooltiptext"
                      >infield: {{ p.stats.other.minutes_played }}'</span
                    >
                    <div
                      class="data-cell p-1 font-bold"
                      v-if="teamId === p.team_id && playerStats === 'red_card'"
                      :style="[
                        p.stats.other.minutes_played
                          ? {
                              maxWidth:
                                (p.stats.other.minutes_played * 100) / 90 + '%',
                              backgroundColor: 'rgb(144,238,144)',
                            }
                          : {
                              maxWidth: '100%',
                              backgroundColor: 'white',
                            },
                      ]"
                    >
                      <div class="text-center">
                        {{ p.stats.cards.redcards }}
                      </div>
                    </div>
                  </div>

                  <div class="flex w-100 tooltip">
                    <span
                      v-if="p.stats.other.minutes_played"
                      class="tooltiptext"
                      >infield: {{ p.stats.other.minutes_played }}'</span
                    >
                    <div
                      class="data-cell p-1 font-bold"
                      v-if="
                        teamId === p.team_id && playerStats === 'foul_drawn'
                      "
                      :style="[
                        p.stats.other.minutes_played
                          ? {
                              maxWidth:
                                (p.stats.other.minutes_played * 100) / 90 + '%',
                              backgroundColor: 'rgb(144,238,144)',
                            }
                          : {
                              maxWidth: '100%',
                              backgroundColor: 'white',
                            },
                      ]"
                    >
                      <div class="text-center">
                        {{ p.stats.fouls.drawn }}
                      </div>
                    </div>
                  </div>

                  <div class="flex w-100 tooltip">
                    <span
                      v-if="p.stats.other.minutes_played"
                      class="tooltiptext"
                      >infield: {{ p.stats.other.minutes_played }}'</span
                    >
                    <div
                      class="data-cell p-1 font-bold"
                      v-if="teamId === p.team_id && playerStats === 'pen_won'"
                      :style="[
                        p.stats.other.minutes_played
                          ? {
                              maxWidth:
                                (p.stats.other.minutes_played * 100) / 90 + '%',
                              backgroundColor: 'rgb(144,238,144)',
                            }
                          : {
                              maxWidth: '100%',
                              backgroundColor: 'white',
                            },
                      ]"
                    >
                      <div class="text-center">
                        {{ p.stats.other.pen_won }}
                      </div>
                    </div>
                  </div>

                  <div class="flex w-100 tooltip">
                    <span
                      v-if="p.stats.other.minutes_played"
                      class="tooltiptext"
                      >infield: {{ p.stats.other.minutes_played }}'</span
                    >
                    <div
                      class="data-cell p-1 font-bold"
                      v-if="
                        teamId === p.team_id && playerStats === 'key_passes'
                      "
                      :style="[
                        p.stats.other.minutes_played
                          ? {
                              maxWidth:
                                (p.stats.other.minutes_played * 100) / 90 + '%',
                              backgroundColor: 'rgb(144,238,144)',
                            }
                          : {
                              maxWidth: '100%',
                              backgroundColor: 'white',
                            },
                      ]"
                    >
                      <div class="text-center">
                        {{ p.stats.passing.key_passes }}
                      </div>
                    </div>
                  </div>

                  <div class="flex w-100 tooltip">
                    <span
                      v-if="p.stats.other.minutes_played"
                      class="tooltiptext"
                      >infield: {{ p.stats.other.minutes_played }}'</span
                    >
                    <div
                      class="data-cell p-1 font-bold"
                      v-if="teamId === p.team_id && playerStats === 'passes'"
                      :style="[
                        p.stats.other.minutes_played
                          ? {
                              maxWidth:
                                (p.stats.other.minutes_played * 100) / 90 + '%',
                              backgroundColor: 'rgb(144,238,144)',
                            }
                          : {
                              maxWidth: '100%',
                              backgroundColor: 'white',
                            },
                      ]"
                    >
                      <div class="text-center">
                        {{ p.stats.passing.passes }}
                      </div>
                    </div>
                  </div>

                  <div class="flex w-100 tooltip">
                    <span
                      v-if="p.stats.other.minutes_played"
                      class="tooltiptext"
                      >infield: {{ p.stats.other.minutes_played }}'</span
                    >
                    <div
                      class="data-cell p-1 font-bold"
                      v-if="
                        teamId === p.team_id && playerStats === 'pen_scored'
                      "
                      :style="[
                        p.stats.other.minutes_played
                          ? {
                              maxWidth:
                                (p.stats.other.minutes_played * 100) / 90 + '%',
                              backgroundColor: 'rgb(144,238,144)',
                            }
                          : {
                              maxWidth: '100%',
                              backgroundColor: 'white',
                            },
                      ]"
                    >
                      <div class="text-center">
                        {{ p.stats.other.pen_scored }}
                      </div>
                    </div>
                  </div>

                  <div class="flex w-100 tooltip">
                    <span
                      v-if="p.stats.other.minutes_played"
                      class="tooltiptext"
                      >infield: {{ p.stats.other.minutes_played }}'</span
                    >
                    <div
                      class="data-cell p-1 font-bold"
                      v-if="
                        teamId === p.team_id && playerStats === 'pen_missed'
                      "
                      :style="[
                        p.stats.other.minutes_played
                          ? {
                              maxWidth:
                                (p.stats.other.minutes_played * 100) / 90 + '%',
                              backgroundColor: 'rgb(144,238,144)',
                            }
                          : {
                              maxWidth: '100%',
                              backgroundColor: 'white',
                            },
                      ]"
                    >
                      <div class="text-center">
                        {{ p.stats.other.pen_missed }}
                      </div>
                    </div>
                  </div>

                  <div class="flex w-100 tooltip">
                    <span
                      v-if="p.stats.other.minutes_played"
                      class="tooltiptext"
                      >infield: {{ p.stats.other.minutes_played }}'</span
                    >
                    <div
                      class="data-cell p-1 font-bold"
                      v-if="
                        teamId === p.team_id && playerStats === 'shots_total'
                      "
                      :style="[
                        p.stats.other.minutes_played
                          ? {
                              maxWidth:
                                (p.stats.other.minutes_played * 100) / 90 + '%',
                              backgroundColor: 'rgb(144,238,144)',
                            }
                          : {
                              maxWidth: '100%',
                              backgroundColor: 'white',
                            },
                      ]"
                    >
                      <div class="text-center">
                        {{ p.stats.shots.shots_total }}
                      </div>
                    </div>
                  </div>

                  <div class="flex w-100 tooltip">
                    <span
                      v-if="p.stats.other.minutes_played"
                      class="tooltiptext"
                      >infield: {{ p.stats.other.minutes_played }}'</span
                    >
                    <div
                      class="data-cell p-1 font-bold"
                      v-if="
                        teamId === p.team_id && playerStats === 'shots_on_goal'
                      "
                      :style="[
                        p.stats.other.minutes_played
                          ? {
                              maxWidth:
                                (p.stats.other.minutes_played * 100) / 90 + '%',
                              backgroundColor: 'rgb(144,238,144)',
                            }
                          : {
                              maxWidth: '100%',
                              backgroundColor: 'white',
                            },
                      ]"
                    >
                      <div class="text-center">
                        {{ p.stats.shots.shots_on_goal }}
                      </div>
                    </div>
                  </div>

                  <div class="flex w-100 tooltip">
                    <span
                      v-if="p.stats.other.minutes_played"
                      class="tooltiptext"
                      >infield: {{ p.stats.other.minutes_played }}'</span
                    >
                    <div
                      class="data-cell p-1 font-bold"
                      v-if="teamId === p.team_id && playerStats === 'offsides'"
                      :style="[
                        p.stats.other.minutes_played
                          ? {
                              maxWidth:
                                (p.stats.other.minutes_played * 100) / 90 + '%',
                              backgroundColor: 'rgb(144,238,144)',
                            }
                          : {
                              maxWidth: '100%',
                              backgroundColor: 'white',
                            },
                      ]"
                    >
                      <div class="text-center">
                        {{ p.stats.other.offsides }}
                      </div>
                    </div>
                  </div>

                  <div class="flex w-100 tooltip">
                    <span
                      v-if="p.stats.other.minutes_played"
                      class="tooltiptext"
                      >infield: {{ p.stats.other.minutes_played }}'</span
                    >
                    <div
                      class="data-cell p-1 font-bold"
                      v-if="teamId === p.team_id && playerStats === 'hit_post'"
                      :style="[
                        p.stats.other.minutes_played
                          ? {
                              maxWidth:
                                (p.stats.other.minutes_played * 100) / 90 + '%',
                              backgroundColor: 'rgb(144,238,144)',
                            }
                          : {
                              maxWidth: '100%',
                              backgroundColor: 'white',
                            },
                      ]"
                    >
                      <div class="text-center">
                        {{ p.stats.other.hit_woodwork }}
                      </div>
                    </div>
                  </div>
                </div>
              </span>
            </div>
          </div>

          <div class="mt-5" v-if="showStats === 'team'">
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
                v-for="l in newTeamStats.data.data"
                :key="l"
              >
                <span class="tooltiptext">{{ l.league.data.name }}</span>
                <img :src="l.league.data.logo_path" class="w-4 md:w-5" alt="" />
              </div>
            </div>

            <div class="flex relative">
              <div class="w-44 border p-1">Against</div>

              <div
                class="data-cell p-1"
                v-for="l in newTeamStats.data.data"
                :key="l"
              >
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
                  v-for="stat in newTeamStats.data.data"
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
                  v-for="stat in newTeamStats.data.data"
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
                  v-for="stat in newTeamStats.data.data"
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
                  v-for="stat in newTeamStats.data.data"
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
                  v-for="stat in newTeamStats.data.data"
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
                  v-for="stat in newTeamStats.data.data"
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
                  v-for="stat in newTeamStats.data.data"
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
                  v-for="stat in newTeamStats.data.data"
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
                  v-for="stat in newTeamStats.data.data"
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
                  v-for="stat in newTeamStats.data.data"
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
                  v-for="stat in newTeamStats.data.data"
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
                  v-for="stat in newTeamStats.data.data"
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
                  v-for="stat in newTeamStats.data.data"
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
                  v-for="stat in newTeamStats.data.data"
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
                  v-for="stat in newTeamStats.data.data"
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
                  v-for="stat in newTeamStats.data.data"
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
                  v-for="stat in newTeamStats.data.data"
                  :key="stat"
                >
                  <span v-for="s in stat.stats.data" :key="s">
                    <span v-if="s.team_id === teamId" class="font-bold">
                      {{ s.saves }}
                    </span>
                  </span>
                </div>
              </div>
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
  width: 3rem !important;
  border: 0.5px solid rgba(0, 0, 0, 0.1);
}

.data-cell-img {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem !important;
  /* border: 0.5px solid rgba(0, 0, 0, 0.1); */
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
