<script setup>
const route = useRoute();
const teamId = parseInt(route.params.id);

let tab_id = ref("A");
const showRow = ref(false);
const showValue = ref("");
const showStats = ref("player");
const playerStats = ref("interception");

const showHome = ref(true);
const showAway = ref(true);
const selectedLeague = ref([]);

const team = ref({});
const teamSeasonPlayersData = ref([]);

const newTeamStats = ref({});
const newTeamFixtures = ref({});
const newTeamFixturesidListString = ref("");

const todayDate = ref("");
const months6Before = ref("");
const leaguesList = ref([]);

const lineupPlayers = ref([]);
const benchPlayers = ref([]);
const lineup = ref([]);
const bench = ref([]);
const allPlayers = ref([]);

const teamPlayers = ref([]);
const uniquePlayers = ref([]);

const finalStats = ref([]);

let today = new Date();

const getDate = function (date) {
  let dd = String(date.getDate() - 1).padStart(2, "0");
  let mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
  let yyyy = date.getFullYear();

  return yyyy + "-" + mm + "-" + dd;
};
const subtract6Months = function (date) {
  date.setMonth(date.getMonth() - 12);
  return date;
};

// ${months6Before.value}
// 2023-03-01

onBeforeMount(async () => {
  months6Before.value = getDate(subtract6Months(new Date()));
  todayDate.value = getDate(today);
  // new work
  team.value = await useFetch(
    () =>
      `https://soccer.sportmonks.com/api/v2.0/teams/${teamId}?api_token=yJa5UcHQ0V22MXG9wlpQ3vtf8ucr6GzJJdd0IShA2j5wOSatggY783JolO6J`
  );
  newTeamStats.value = await useFetch(
    () =>
      `https://soccer.sportmonks.com/api/v2.0/fixtures/between/${months6Before.value}/${todayDate.value}/${teamId}?api_token=yJa5UcHQ0V22MXG9wlpQ3vtf8ucr6GzJJdd0IShA2j5wOSatggY783JolO6J&include=stats,league,lineup.player,bench.player,localTeam,visitorTeam`
  );

  if (newTeamStats.value.data) {
    newTeamStats.value.data.data.sort(
      (a, b) =>
        new Date(b.time.starting_at.date) - new Date(a.time.starting_at.date)
    );
    if (newTeamStats.value.data.data.length > 20) {
      newTeamStats.value.data.data = newTeamStats.value.data.data.slice(0, 20);
    }
    console.log("data array", newTeamStats.value.data.data);
    newTeamStats.value.data.data.map((e) => {
      e.lineup.data.map((p) => {
        if (p.team_id === teamId) {
          lineupPlayers.value.push(p);
          lineup.value.push(p);
        }
      });
      e.bench.data.map((p) => {
        if (p.team_id === teamId) {
          benchPlayers.value.push(p);
          bench.value.push(p);
        }
      });
      teamPlayers.value = [...lineupPlayers.value, ...benchPlayers.value];
      allPlayers.value = [...lineup.value, ...bench.value];
      console.log("teamplayers", teamPlayers.value);
      e.teamPlayers = teamPlayers.value;
      lineupPlayers.value = [];
      benchPlayers.value = [];
    });
    uniquePlayers.value = getUniquePlayersById(allPlayers.value);
    uniquePlayers.value.forEach((player, index) => {
      finalStats.value.push({
        playerId: player.player_id,
        player: player.player.data,
        matchesData: [],
      });
      newTeamStats.value.data.data.map((match) => {
        let team_Player = null;
        match.teamPlayers.map((teamPlayer) => {
          if (player.player_id === teamPlayer.player_id) {
            team_Player = teamPlayer;
          }
        });

        if (team_Player) {
          const test = match.teamPlayers
            .filter((e) => e.player_id === player.player_id)
            .map((e) => e.stats);
          finalStats.value[index].matchesData.push({
            matchId: match.id,
            league: match.league_id,
            localTeam: match.localteam_id,
            visitorTeam: match.visitorteam_id,
            p_stats: test,
          });
        } else {
          finalStats.value[index].matchesData.push({
            matchId: match.id,
            league: match.league_id,
            localTeam: match.localteam_id,
            visitorTeam: match.visitorteam_id,
            p_stats: [],
          });
        }
      });
    });
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
  }
  if (value === "away") {
    showAway.value = !showAway.value;
  }
};

// create a unique array of objects
function getUniquePlayersById(originalArray) {
  let uniqueArray = [];
  originalArray.forEach((obj) => {
    const id = obj.player_id;
    if (!uniqueArray.find((o) => o.player_id === id)) {
      uniqueArray.push(obj);
    }
  });
  return uniqueArray;
}
</script>

<template>
  <div class="w-11/12 md:w-4/5 mx-auto py-8">
    <div class="flex justify-start text-gray-600">
      <a href="/" class="flex self-center mr-3"
        ><img src="@/assets/home.png" alt="icon" class="opacity-50"
      /></a>
      <span class="mr-3 self-center">
        <img src="@/assets/right.png" class="opacity-50" alt="icon" />
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
              alt="logo"
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

      <!-- below section for testing  -->
      <div class="pb-16 text-xs overflow-x-auto overflow-visible">
        <div class="relative rounded w-[1200px]" v-if="newTeamStats.data">
          <div class="mt-5" v-if="showStats === 'team'">
            <div
              class="bg-[#0d406a] text-white p-5 text-3xl mb-5 capitalize"
              v-if="team.data"
            >
              {{ team.data.data.name }} Stats
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
          <div class="pt-20" v-if="showStats === 'player'">
            <div v-if="newTeamStats.data">
              <div class="flex">
                <div class="w-40 md:w-64"></div>
                <div v-for="t in newTeamStats.data.data">
                  <div
                    class="stats-cell p-1 relative mx-auto cursor-pointer"
                    v-if="
                      t.localteam_id === teamId &&
                      selectedLeague.includes(t.league_id) &&
                      (t.localteam_id === teamId ? showHome : showAway)
                    "
                    @click="goto(t.visitorteam_id)"
                  >
                    <img
                      :src="t.visitorTeam.data.logo_path"
                      class="w-6 md:w-7 mx-auto"
                      alt=""
                    />
                    <span
                      class="absolute bottom-0 right-1 text-[0.6rem] font-medium"
                      >H</span
                    >
                  </div>
                  <div
                    class="stats-cell p-1 relative mx-auto cursor-pointer"
                    v-else-if="
                      t.visitorteam_id === teamId &&
                      selectedLeague.includes(t.league_id) &&
                      (t.localteam_id === teamId ? showHome : showAway)
                    "
                    @click="goto(t.localteam_id)"
                  >
                    <img
                      :src="t.localTeam.data.logo_path"
                      class="w-6 md:w-7 mx-auto"
                      alt=""
                    />
                    <span
                      class="absolute bottom-0 right-1 text-[0.6rem] font-medium"
                      >A</span
                    >
                  </div>
                </div>
              </div>
            </div>

            <div class="flex" v-for="stats of finalStats">
              <div class="flex w-40 md:w-64 h-[40px] player-name-cell">
                <img
                  class="p-1 mr-1 h-8 self-center"
                  :src="stats.player.image_path"
                  alt=""
                />
                <div class="self-center p-1 hidden md:inline-flex">
                  {{ stats.player.display_name }}
                </div>
                <div class="self-center p-1 inline-flex md:hidden">
                  {{ stats.player.common_name }}
                </div>
              </div>
              <div v-for="player of stats.matchesData">
                <div
                  class="flex w-100 tooltip"
                  v-if="playerStats === 'interception'"
                >
                  <span v-if="player.p_stats[0]" class="tooltiptext"
                    >infield:
                    {{ player.p_stats[0].other.minutes_played }}'</span
                  >
                  <div
                    class="flex justify-between text-center text-lg font-semibold z-10 stats-cell"
                    v-if="
                      player.p_stats[0] &&
                      playerStats === 'interception' &&
                      selectedLeague.includes(player.league) &&
                      (player.localTeam === teamId ? showHome : showAway)
                    "
                  >
                    <p class="self-center justify-between w-full">
                      {{ player.p_stats[0].other.interceptions }}
                    </p>
                  </div>
                  <div
                    v-if="player.p_stats[0]"
                    class="absolute h-[40px] z-0"
                    :style="[
                      player.p_stats[0].other.minutes_played
                        ? {
                            width:
                              (player.p_stats[0].other.minutes_played * 100) /
                                90 +
                              '%',
                            backgroundColor: 'rgb(144,238,144)',
                          }
                        : {
                            width: '100%',
                            backgroundColor: 'white',
                          },
                    ]"
                  ></div>
                  <div
                    v-else-if="
                      !player.p_stats[0] &&
                      playerStats === 'interception' &&
                      selectedLeague.includes(player.league) &&
                      (player.localTeam === teamId ? showHome : showAway)
                    "
                    class="stats-cell p-1 relative mx-auto"
                  ></div>
                </div>

                <div
                  class="flex w-100 tooltip"
                  v-if="playerStats === 'tackles'"
                >
                  <span v-if="player.p_stats[0]" class="tooltiptext"
                    >infield:
                    {{ player.p_stats[0].other.minutes_played }}'</span
                  >
                  <div
                    class="flex justify-between text-center text-lg font-semibold z-10 stats-cell"
                    v-if="
                      player.p_stats[0] &&
                      playerStats === 'tackles' &&
                      selectedLeague.includes(player.league) &&
                      (player.localTeam === teamId ? showHome : showAway)
                    "
                  >
                    <p class="self-center justify-between w-full">
                      {{ player.p_stats[0].other.tackles }}
                    </p>
                  </div>
                  <div
                    v-if="player.p_stats[0]"
                    class="absolute h-[40px] z-0"
                    :style="[
                      player.p_stats[0].other.minutes_played
                        ? {
                            width:
                              (player.p_stats[0].other.minutes_played * 100) /
                                90 +
                              '%',
                            backgroundColor: 'rgb(144,238,144)',
                          }
                        : {
                            width: '100%',
                            backgroundColor: 'white',
                          },
                    ]"
                  >
                    <span class="invisible">0</span>
                  </div>
                   <div
                    v-else-if="
                      !player.p_stats[0] &&
                      playerStats === 'tackles' &&
                      selectedLeague.includes(player.league) &&
                      (player.localTeam === teamId ? showHome : showAway)
                    "
                    class="stats-cell p-1 relative mx-auto"
                  ></div>
                </div>

                <div class="flex w-100 tooltip" v-if="playerStats === 'blocks'">
                  <span v-if="player.p_stats[0]" class="tooltiptext"
                    >infield:
                    {{ player.p_stats[0].other.minutes_played }}'</span
                  >
                  <div
                    class="flex justify-between text-center text-lg font-semibold z-10 stats-cell"
                    v-if="
                      player.p_stats[0] &&
                      playerStats === 'blocks' &&
                      selectedLeague.includes(player.league) &&
                      (player.localTeam === teamId ? showHome : showAway)
                    "
                  >
                    <p class="self-center justify-between w-full">
                      {{ player.p_stats[0].other.blocks }}
                    </p>
                  </div>
                  <div
                    v-if="player.p_stats[0]"
                    class="absolute h-[40px] z-0"
                    :style="[
                      player.p_stats[0].other.minutes_played
                        ? {
                            width:
                              (player.p_stats[0].other.minutes_played * 100) /
                                90 +
                              '%',
                            backgroundColor: 'rgb(144,238,144)',
                          }
                        : {
                            width: '100%',
                            backgroundColor: 'white',
                          },
                    ]"
                  >
                    <span class="invisible">0</span>
                  </div>
                   <div
                    v-else-if="
                      !player.p_stats[0] &&
                      playerStats === 'blocks' &&
                      selectedLeague.includes(player.league) &&
                      (player.localTeam === teamId ? showHome : showAway)
                    "
                    class="stats-cell p-1 relative mx-auto"
                  ></div>
                </div>

                <div
                  class="flex w-100 tooltip"
                  v-if="playerStats === 'total_duels'"
                >
                  <span v-if="player.p_stats[0]" class="tooltiptext"
                    >infield:
                    {{ player.p_stats[0].other.minutes_played }}'</span
                  >
                  <div
                    class="flex justify-between text-center text-lg font-semibold z-10 stats-cell"
                    v-if="
                      player.p_stats[0] &&
                      playerStats === 'total_duels' &&
                      selectedLeague.includes(player.league) &&
                      (player.localTeam === teamId ? showHome : showAway)
                    "
                  >
                    <p class="self-center justify-between w-full">
                      {{ player.p_stats[0].duels.total }}
                    </p>
                  </div>
                  <div
                    v-if="player.p_stats[0]"
                    class="absolute h-[40px] z-0"
                    :style="[
                      player.p_stats[0].other.minutes_played
                        ? {
                            width:
                              (player.p_stats[0].other.minutes_played * 100) /
                                90 +
                              '%',
                            backgroundColor: 'rgb(144,238,144)',
                          }
                        : {
                            width: '100%',
                            backgroundColor: 'white',
                          },
                    ]"
                  >
                    <span class="invisible">0</span>
                  </div>
                   <div
                    v-else-if="
                      !player.p_stats[0] &&
                      playerStats === 'total_duels' &&
                      selectedLeague.includes(player.league) &&
                      (player.localTeam === teamId ? showHome : showAway)
                    "
                    class="stats-cell p-1 relative mx-auto"
                  ></div>
                </div>

                <div
                  class="flex w-100 tooltip"
                  v-if="playerStats === 'duel_won'"
                >
                  <span v-if="player.p_stats[0]" class="tooltiptext"
                    >infield:
                    {{ player.p_stats[0].other.minutes_played }}'</span
                  >
                  <div
                    class="flex justify-between text-center text-lg font-semibold z-10 stats-cell"
                    v-if="
                      player.p_stats[0] &&
                      playerStats === 'duel_won' &&
                      selectedLeague.includes(player.league) &&
                      (player.localTeam === teamId ? showHome : showAway)
                    "
                  >
                    <p class="self-center justify-between w-full">
                      {{ player.p_stats[0].duels.won }}
                    </p>
                  </div>
                  <div
                    v-if="player.p_stats[0]"
                    class="absolute h-[40px] z-0"
                    :style="[
                      player.p_stats[0].other.minutes_played
                        ? {
                            width:
                              (player.p_stats[0].other.minutes_played * 100) /
                                90 +
                              '%',
                            backgroundColor: 'rgb(144,238,144)',
                          }
                        : {
                            width: '100%',
                            backgroundColor: 'white',
                          },
                    ]"
                  >
                    <span class="invisible">0</span>
                  </div>
                   <div
                    v-else-if="
                      !player.p_stats[0] &&
                      playerStats === 'duel_won' &&
                      selectedLeague.includes(player.league) &&
                      (player.localTeam === teamId ? showHome : showAway)
                    "
                    class="stats-cell p-1 relative mx-auto"
                  ></div>
                </div>

                <div
                  class="flex w-100 tooltip"
                  v-if="playerStats === 'foul_committed'"
                >
                  <span v-if="player.p_stats[0]" class="tooltiptext"
                    >infield:
                    {{ player.p_stats[0].other.minutes_played }}'</span
                  >
                  <div
                    class="flex justify-between text-center text-lg font-semibold z-10 stats-cell"
                    v-if="
                      player.p_stats[0] &&
                      playerStats === 'foul_committed' &&
                      selectedLeague.includes(player.league) &&
                      (player.localTeam === teamId ? showHome : showAway)
                    "
                  >
                    <p class="self-center justify-between w-full">
                      {{ player.p_stats[0].fouls.committed }}
                    </p>
                  </div>
                  <div
                    v-if="player.p_stats[0]"
                    class="absolute h-[40px] z-0"
                    :style="[
                      player.p_stats[0].other.minutes_played
                        ? {
                            width:
                              (player.p_stats[0].other.minutes_played * 100) /
                                90 +
                              '%',
                            backgroundColor: 'rgb(144,238,144)',
                          }
                        : {
                            width: '100%',
                            backgroundColor: 'white',
                          },
                    ]"
                  >
                    <span class="invisible">0</span>
                  </div>
                   <div
                    v-else-if="
                      !player.p_stats[0] &&
                      playerStats === 'foul_committed' &&
                      selectedLeague.includes(player.league) &&
                      (player.localTeam === teamId ? showHome : showAway)
                    "
                    class="stats-cell p-1 relative mx-auto"
                  ></div>
                </div>

                <div
                  class="flex w-100 tooltip"
                  v-if="playerStats === 'pen_saved'"
                >
                  <span v-if="player.p_stats[0]" class="tooltiptext"
                    >infield:
                    {{ player.p_stats[0].other.minutes_played }}'</span
                  >
                  <div
                    class="flex justify-between text-center text-lg font-semibold z-10 stats-cell"
                    v-if="
                      player.p_stats[0] &&
                      playerStats === 'pen_saved' &&
                      selectedLeague.includes(player.league) &&
                      (player.localTeam === teamId ? showHome : showAway)
                    "
                  >
                    <p class="self-center justify-between w-full">
                      {{ player.p_stats[0].other.pen_saved }}
                    </p>
                  </div>
                  <div
                    v-if="player.p_stats[0]"
                    class="absolute h-[40px] z-0"
                    :style="[
                      player.p_stats[0].other.minutes_played
                        ? {
                            width:
                              (player.p_stats[0].other.minutes_played * 100) /
                                90 +
                              '%',
                            backgroundColor: 'rgb(144,238,144)',
                          }
                        : {
                            width: '100%',
                            backgroundColor: 'white',
                          },
                    ]"
                  >
                    <span class="invisible">0</span>
                  </div>
                   <div
                    v-else-if="
                      !player.p_stats[0] &&
                      playerStats === 'pen_saved' &&
                      selectedLeague.includes(player.league) &&
                      (player.localTeam === teamId ? showHome : showAway)
                    "
                    class="stats-cell p-1 relative mx-auto"
                  ></div>
                </div>

                <div
                  class="flex w-100 tooltip"
                  v-if="playerStats === 'drib_past'"
                >
                  <span v-if="player.p_stats[0]" class="tooltiptext"
                    >infield:
                    {{ player.p_stats[0].other.minutes_played }}'</span
                  >
                  <div
                    class="flex justify-between text-center text-lg font-semibold z-10 stats-cell"
                    v-if="
                      player.p_stats[0] &&
                      playerStats === 'drib_past' &&
                      selectedLeague.includes(player.league) &&
                      (player.localTeam === teamId ? showHome : showAway)
                    "
                  >
                    <p class="self-center justify-between w-full">
                      {{ player.p_stats[0].dribbles.dribbled_past }}
                    </p>
                  </div>
                  <div
                    v-if="player.p_stats[0]"
                    class="absolute h-[40px] z-0"
                    :style="[
                      player.p_stats[0].other.minutes_played
                        ? {
                            width:
                              (player.p_stats[0].other.minutes_played * 100) /
                                90 +
                              '%',
                            backgroundColor: 'rgb(144,238,144)',
                          }
                        : {
                            width: '100%',
                            backgroundColor: 'white',
                          },
                    ]"
                  >
                    <span class="invisible">0</span>
                  </div>
                   <div
                    v-else-if="
                      !player.p_stats[0] &&
                      playerStats === 'drib_past' &&
                      selectedLeague.includes(player.league) &&
                      (player.localTeam === teamId ? showHome : showAway)
                    "
                    class="stats-cell p-1 relative mx-auto"
                  ></div>
                </div>

                <div
                  class="flex w-100 tooltip"
                  v-if="playerStats === 'pen_committed'"
                >
                  <span v-if="player.p_stats[0]" class="tooltiptext"
                    >infield:
                    {{ player.p_stats[0].other.minutes_played }}'</span
                  >
                  <div
                    class="flex justify-between text-center text-lg font-semibold z-10 stats-cell"
                    v-if="
                      player.p_stats[0] &&
                      playerStats === 'pen_committed' &&
                      selectedLeague.includes(player.league) &&
                      (player.localTeam === teamId ? showHome : showAway)
                    "
                  >
                    <p class="self-center justify-between w-full">
                      {{ player.p_stats[0].other.pen_committed }}
                    </p>
                  </div>
                  <div
                    v-if="player.p_stats[0]"
                    class="absolute h-[40px] z-0"
                    :style="[
                      player.p_stats[0].other.minutes_played
                        ? {
                            width:
                              (player.p_stats[0].other.minutes_played * 100) /
                                90 +
                              '%',
                            backgroundColor: 'rgb(144,238,144)',
                          }
                        : {
                            width: '100%',
                            backgroundColor: 'white',
                          },
                    ]"
                  >
                    <span class="invisible">0</span>
                  </div>
                   <div
                    v-else-if="
                      !player.p_stats[0] &&
                      playerStats === 'pen_committed' &&
                      selectedLeague.includes(player.league) &&
                      (player.localTeam === teamId ? showHome : showAway)
                    "
                    class="stats-cell p-1 relative mx-auto"
                  ></div>
                </div>

                <div
                  class="flex w-100 tooltip"
                  v-if="playerStats === 'yellow_card'"
                >
                  <span v-if="player.p_stats[0]" class="tooltiptext"
                    >infield:
                    {{ player.p_stats[0].other.minutes_played }}'</span
                  >
                  <div
                    class="flex justify-between text-center text-lg font-semibold z-10 stats-cell"
                    v-if="
                      player.p_stats[0] &&
                      playerStats === 'yellow_card' &&
                      selectedLeague.includes(player.league) &&
                      (player.localTeam === teamId ? showHome : showAway)
                    "
                  >
                    <p class="self-center justify-between w-full">
                      {{ player.p_stats[0].cards.yellowcards }}
                    </p>
                  </div>
                  <div
                    v-if="player.p_stats[0]"
                    class="absolute h-[40px] z-0"
                    :style="[
                      player.p_stats[0].other.minutes_played
                        ? {
                            width:
                              (player.p_stats[0].other.minutes_played * 100) /
                                90 +
                              '%',
                            backgroundColor: 'rgb(144,238,144)',
                          }
                        : {
                            width: '100%',
                            backgroundColor: 'white',
                          },
                    ]"
                  >
                    <span class="invisible">0</span>
                  </div>
                   <div
                    v-else-if="
                      !player.p_stats[0] &&
                      playerStats === 'yellow_card' &&
                      selectedLeague.includes(player.league) &&
                      (player.localTeam === teamId ? showHome : showAway)
                    "
                    class="stats-cell p-1 relative mx-auto"
                  ></div>
                </div>

                <div
                  class="flex w-100 tooltip"
                  v-if="playerStats === 'red_card'"
                >
                  <span v-if="player.p_stats[0]" class="tooltiptext"
                    >infield:
                    {{ player.p_stats[0].other.minutes_played }}'</span
                  >
                  <div
                    class="flex justify-between text-center text-lg font-semibold z-10 stats-cell"
                    v-if="
                      player.p_stats[0] &&
                      playerStats === 'red_card' &&
                      selectedLeague.includes(player.league) &&
                      (player.localTeam === teamId ? showHome : showAway)
                    "
                  >
                    <p class="self-center justify-between w-full">
                      {{ player.p_stats[0].cards.redcards }}
                    </p>
                  </div>
                  <div
                    v-if="player.p_stats[0]"
                    class="absolute h-[40px] z-0"
                    :style="[
                      player.p_stats[0].other.minutes_played
                        ? {
                            width:
                              (player.p_stats[0].other.minutes_played * 100) /
                                90 +
                              '%',
                            backgroundColor: 'rgb(144,238,144)',
                          }
                        : {
                            width: '100%',
                            backgroundColor: 'white',
                          },
                    ]"
                  >
                    <span class="invisible">0</span>
                  </div>
                   <div
                    v-else-if="
                      !player.p_stats[0] &&
                      playerStats === 'red_card' &&
                      selectedLeague.includes(player.league) &&
                      (player.localTeam === teamId ? showHome : showAway)
                    "
                    class="stats-cell p-1 relative mx-auto"
                  ></div>
                </div>

                <div
                  class="flex w-100 tooltip"
                  v-if="playerStats === 'foul_drawn'"
                >
                  <span v-if="player.p_stats[0]" class="tooltiptext"
                    >infield:
                    {{ player.p_stats[0].other.minutes_played }}'</span
                  >
                  <div
                    class="flex justify-between text-center text-lg font-semibold z-10 stats-cell"
                    v-if="
                      player.p_stats[0] &&
                      playerStats === 'foul_drawn' &&
                      selectedLeague.includes(player.league) &&
                      (player.localTeam === teamId ? showHome : showAway)
                    "
                  >
                    <p class="self-center justify-between w-full">
                      {{ player.p_stats[0].fouls.drawn }}
                    </p>
                  </div>
                  <div
                    v-if="player.p_stats[0]"
                    class="absolute h-[40px] z-0"
                    :style="[
                      player.p_stats[0].other.minutes_played
                        ? {
                            width:
                              (player.p_stats[0].other.minutes_played * 100) /
                                90 +
                              '%',
                            backgroundColor: 'rgb(144,238,144)',
                          }
                        : {
                            width: '100%',
                            backgroundColor: 'white',
                          },
                    ]"
                  >
                    <span class="invisible">0</span>
                  </div>
                   <div
                    v-else-if="
                      !player.p_stats[0] &&
                      playerStats === 'foul_drawn' &&
                      selectedLeague.includes(player.league) &&
                      (player.localTeam === teamId ? showHome : showAway)
                    "
                    class="stats-cell p-1 relative mx-auto"
                  ></div>
                </div>

                <div
                  class="flex w-100 tooltip"
                  v-if="playerStats === 'pen_won'"
                >
                  <span v-if="player.p_stats[0]" class="tooltiptext"
                    >infield:
                    {{ player.p_stats[0].other.minutes_played }}'</span
                  >
                  <div
                    class="flex justify-between text-center text-lg font-semibold z-10 stats-cell"
                    v-if="
                      player.p_stats[0] &&
                      playerStats === 'pen_won' &&
                      selectedLeague.includes(player.league) &&
                      (player.localTeam === teamId ? showHome : showAway)
                    "
                  >
                    <p class="self-center justify-between w-full">
                      {{ player.p_stats[0].other.pen_won }}
                    </p>
                  </div>
                  <div
                    v-if="player.p_stats[0]"
                    class="absolute h-[40px] z-0"
                    :style="[
                      player.p_stats[0].other.minutes_played
                        ? {
                            width:
                              (player.p_stats[0].other.minutes_played * 100) /
                                90 +
                              '%',
                            backgroundColor: 'rgb(144,238,144)',
                          }
                        : {
                            width: '100%',
                            backgroundColor: 'white',
                          },
                    ]"
                  >
                    <span class="invisible">0</span>
                  </div>
                   <div
                    v-else-if="
                      !player.p_stats[0] &&
                      playerStats === 'pen_won' &&
                      selectedLeague.includes(player.league) &&
                      (player.localTeam === teamId ? showHome : showAway)
                    "
                    class="stats-cell p-1 relative mx-auto"
                  ></div>
                </div>

                <div
                  class="flex w-100 tooltip"
                  v-if="playerStats === 'key_passes'"
                >
                  <span v-if="player.p_stats[0]" class="tooltiptext"
                    >infield:
                    {{ player.p_stats[0].other.minutes_played }}'</span
                  >
                  <div
                    class="flex justify-between text-center text-lg font-semibold z-10 stats-cell"
                    v-if="
                      player.p_stats[0] &&
                      playerStats === 'key_passes' &&
                      selectedLeague.includes(player.league) &&
                      (player.localTeam === teamId ? showHome : showAway)
                    "
                  >
                    <p class="self-center justify-between w-full">
                      {{ player.p_stats[0].passing.key_passes }}
                    </p>
                  </div>
                  <div
                    v-if="player.p_stats[0]"
                    class="absolute h-[40px] z-0"
                    :style="[
                      player.p_stats[0].other.minutes_played
                        ? {
                            width:
                              (player.p_stats[0].other.minutes_played * 100) /
                                90 +
                              '%',
                            backgroundColor: 'rgb(144,238,144)',
                          }
                        : {
                            width: '100%',
                            backgroundColor: 'white',
                          },
                    ]"
                  >
                    <span class="invisible">0</span>
                  </div>
                   <div
                    v-else-if="
                      !player.p_stats[0] &&
                      playerStats === 'key_passes' &&
                      selectedLeague.includes(player.league) &&
                      (player.localTeam === teamId ? showHome : showAway)
                    "
                    class="stats-cell p-1 relative mx-auto"
                  ></div>
                </div>

                <div class="flex w-100 tooltip" v-if="playerStats === 'passes'">
                  <span v-if="player.p_stats[0]" class="tooltiptext"
                    >infield:
                    {{ player.p_stats[0].other.minutes_played }}'</span
                  >
                  <div
                    class="flex justify-between text-center text-lg font-semibold z-10 stats-cell"
                    v-if="
                      player.p_stats[0] &&
                      playerStats === 'passes' &&
                      selectedLeague.includes(player.league) &&
                      (player.localTeam === teamId ? showHome : showAway)
                    "
                  >
                    <p class="self-center justify-between w-full">
                      {{ player.p_stats[0].passing.passes }}
                    </p>
                  </div>
                  <div
                    v-if="player.p_stats[0]"
                    class="absolute h-[40px] z-0"
                    :style="[
                      player.p_stats[0].other.minutes_played
                        ? {
                            width:
                              (player.p_stats[0].other.minutes_played * 100) /
                                90 +
                              '%',
                            backgroundColor: 'rgb(144,238,144)',
                          }
                        : {
                            width: '100%',
                            backgroundColor: 'white',
                          },
                    ]"
                  >
                    <span class="invisible">0</span>
                  </div>
                   <div
                    v-else-if="
                      !player.p_stats[0] &&
                      playerStats === 'passes' &&
                      selectedLeague.includes(player.league) &&
                      (player.localTeam === teamId ? showHome : showAway)
                    "
                    class="stats-cell p-1 relative mx-auto"
                  ></div>
                </div>

                <div
                  class="flex w-100 tooltip"
                  v-if="playerStats === 'pen_scored'"
                >
                  <span v-if="player.p_stats[0]" class="tooltiptext"
                    >infield:
                    {{ player.p_stats[0].other.minutes_played }}'</span
                  >
                  <div
                    class="flex justify-between text-center text-lg font-semibold z-10 stats-cell"
                    v-if="
                      player.p_stats[0] &&
                      playerStats === 'pen_scored' &&
                      selectedLeague.includes(player.league) &&
                      (player.localTeam === teamId ? showHome : showAway)
                    "
                  >
                    <p class="self-center justify-between w-full">
                      {{ player.p_stats[0].other.pen_scored }}
                    </p>
                  </div>
                  <div
                    v-if="player.p_stats[0]"
                    class="absolute h-[40px] z-0"
                    :style="[
                      player.p_stats[0].other.minutes_played
                        ? {
                            width:
                              (player.p_stats[0].other.minutes_played * 100) /
                                90 +
                              '%',
                            backgroundColor: 'rgb(144,238,144)',
                          }
                        : {
                            width: '100%',
                            backgroundColor: 'white',
                          },
                    ]"
                  >
                    <span class="invisible">0</span>
                  </div>
                   <div
                    v-else-if="
                      !player.p_stats[0] &&
                      playerStats === 'pen_scored' &&
                      selectedLeague.includes(player.league) &&
                      (player.localTeam === teamId ? showHome : showAway)
                    "
                    class="stats-cell p-1 relative mx-auto"
                  ></div>
                </div>

                <div
                  class="flex w-100 tooltip"
                  v-if="playerStats === 'pen_missed'"
                >
                  <span v-if="player.p_stats[0]" class="tooltiptext"
                    >infield:
                    {{ player.p_stats[0].other.minutes_played }}'</span
                  >
                  <div
                    class="flex justify-between text-center text-lg font-semibold z-10 stats-cell"
                    v-if="
                      player.p_stats[0] &&
                      playerStats === 'pen_missed' &&
                      selectedLeague.includes(player.league) &&
                      (player.localTeam === teamId ? showHome : showAway)
                    "
                  >
                    <p class="self-center justify-between w-full">
                      {{ player.p_stats[0].other.pen_missed }}
                    </p>
                  </div>
                  <div
                    v-if="player.p_stats[0]"
                    class="absolute h-[40px] z-0"
                    :style="[
                      player.p_stats[0].other.minutes_played
                        ? {
                            width:
                              (player.p_stats[0].other.minutes_played * 100) /
                                90 +
                              '%',
                            backgroundColor: 'rgb(144,238,144)',
                          }
                        : {
                            width: '100%',
                            backgroundColor: 'white',
                          },
                    ]"
                  >
                    <span class="invisible">0</span>
                  </div>
                   <div
                    v-else-if="
                      !player.p_stats[0] &&
                      playerStats === 'pen_missed' &&
                      selectedLeague.includes(player.league) &&
                      (player.localTeam === teamId ? showHome : showAway)
                    "
                    class="stats-cell p-1 relative mx-auto"
                  ></div>
                </div>

                <div
                  class="flex w-100 tooltip"
                  v-if="playerStats === 'shots_total'"
                >
                  <span v-if="player.p_stats[0]" class="tooltiptext"
                    >infield:
                    {{ player.p_stats[0].other.minutes_played }}'</span
                  >
                  <div
                    class="flex justify-between text-center text-lg font-semibold z-10 stats-cell"
                    v-if="
                      player.p_stats[0] &&
                      playerStats === 'shots_total' &&
                      selectedLeague.includes(player.league) &&
                      (player.localTeam === teamId ? showHome : showAway)
                    "
                  >
                    <p class="self-center justify-between w-full">
                      {{ player.p_stats[0].shots.shots_total }}
                    </p>
                  </div>
                  <div
                    v-if="player.p_stats[0]"
                    class="absolute h-[40px] z-0"
                    :style="[
                      player.p_stats[0].other.minutes_played
                        ? {
                            width:
                              (player.p_stats[0].other.minutes_played * 100) /
                                90 +
                              '%',
                            backgroundColor: 'rgb(144,238,144)',
                          }
                        : {
                            width: '100%',
                            backgroundColor: 'white',
                          },
                    ]"
                  >
                    <span class="invisible">0</span>
                  </div>
                   <div
                    v-else-if="
                      !player.p_stats[0] &&
                      playerStats === 'shots_total' &&
                      selectedLeague.includes(player.league) &&
                      (player.localTeam === teamId ? showHome : showAway)
                    "
                    class="stats-cell p-1 relative mx-auto"
                  ></div>
                </div>

                <div
                  class="flex w-100 tooltip"
                  v-if="playerStats === 'shots_on_goal'"
                >
                  <span v-if="player.p_stats[0]" class="tooltiptext"
                    >infield:
                    {{ player.p_stats[0].other.minutes_played }}'</span
                  >
                  <div
                    class="flex justify-between text-center text-lg font-semibold z-10 stats-cell"
                    v-if="
                      player.p_stats[0] &&
                      playerStats === 'shots_on_goal' &&
                      selectedLeague.includes(player.league) &&
                      (player.localTeam === teamId ? showHome : showAway)
                    "
                  >
                    <p class="self-center justify-between w-full">
                      {{ player.p_stats[0].shots.shots_on_goal }}
                    </p>
                  </div>
                  <div
                    v-if="player.p_stats[0]"
                    class="absolute h-[40px] z-0"
                    :style="[
                      player.p_stats[0].other.minutes_played
                        ? {
                            width:
                              (player.p_stats[0].other.minutes_played * 100) /
                                90 +
                              '%',
                            backgroundColor: 'rgb(144,238,144)',
                          }
                        : {
                            width: '100%',
                            backgroundColor: 'white',
                          },
                    ]"
                  >
                    <span class="invisible">0</span>
                  </div>
                   <div
                    v-else-if="
                      !player.p_stats[0] &&
                      playerStats === 'shots_on_goal' &&
                      selectedLeague.includes(player.league) &&
                      (player.localTeam === teamId ? showHome : showAway)
                    "
                    class="stats-cell p-1 relative mx-auto"
                  ></div>
                </div>

                <div
                  class="flex w-100 tooltip"
                  v-if="playerStats === 'offsides'"
                >
                  <span v-if="player.p_stats[0]" class="tooltiptext"
                    >infield:
                    {{ player.p_stats[0].other.minutes_played }}'</span
                  >
                  <div
                    class="flex justify-between text-center text-lg font-semibold z-10 stats-cell"
                    v-if="
                      player.p_stats[0] &&
                      playerStats === 'offsides' &&
                      selectedLeague.includes(player.league) &&
                      (player.localTeam === teamId ? showHome : showAway)
                    "
                  >
                    <p class="self-center justify-between w-full">
                      {{ player.p_stats[0].other.offsides }}
                    </p>
                  </div>
                  <div
                    v-if="player.p_stats[0]"
                    class="absolute h-[40px] z-0"
                    :style="[
                      player.p_stats[0].other.minutes_played
                        ? {
                            width:
                              (player.p_stats[0].other.minutes_played * 100) /
                                90 +
                              '%',
                            backgroundColor: 'rgb(144,238,144)',
                          }
                        : {
                            width: '100%',
                            backgroundColor: 'white',
                          },
                    ]"
                  >
                    <span class="invisible">0</span>
                  </div>
                   <div
                    v-else-if="
                      !player.p_stats[0] &&
                      playerStats === 'offsides' &&
                      selectedLeague.includes(player.league) &&
                      (player.localTeam === teamId ? showHome : showAway)
                    "
                    class="stats-cell p-1 relative mx-auto"
                  ></div>
                </div>

                <div
                  class="flex w-100 tooltip"
                  v-if="playerStats === 'hit_post'"
                >
                  <span v-if="player.p_stats[0]" class="tooltiptext"
                    >infield:
                    {{ player.p_stats[0].other.minutes_played }}'</span
                  >
                  <div
                    class="flex justify-between text-center text-lg font-semibold z-10 stats-cell"
                    v-if="
                      player.p_stats[0] &&
                      playerStats === 'hit_post' &&
                      selectedLeague.includes(player.league) &&
                      (player.localTeam === teamId ? showHome : showAway)
                    "
                  >
                    <p class="self-center justify-between w-full">
                      {{ player.p_stats[0].other.hit_woodwork }}
                    </p>
                  </div>
                  <div
                    v-if="player.p_stats[0]"
                    class="absolute h-[40px] z-0"
                    :style="[
                      player.p_stats[0].other.minutes_played
                        ? {
                            width:
                              (player.p_stats[0].other.minutes_played * 100) /
                                90 +
                              '%',
                            backgroundColor: 'rgb(144,238,144)',
                          }
                        : {
                            width: '100%',
                            backgroundColor: 'white',
                          },
                    ]"
                  >
                    <span class="invisible">0</span>
                  </div>
                   <div
                    v-else-if="
                      !player.p_stats[0] &&
                      playerStats === 'hit_post' &&
                      selectedLeague.includes(player.league) &&
                      (player.localTeam === teamId ? showHome : showAway)
                    "
                    class="stats-cell p-1 relative mx-auto"
                  ></div>
                </div>

                <div class="w-12 text-center" v-if="player.p_stats[0] === null">
                  0
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

.stats-cell {
  width: 40px;
  height: 40px;
  border: 1px solid #000;
}

.player-name-cell {
  border: 1px solid #000;
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
  background-color: #000000;
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
