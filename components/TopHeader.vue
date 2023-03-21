<script setup>
const allLeagues = ref(false);
const leagues = ref({});
const showmenu = ref(false);
onBeforeMount(async () => {
  leagues.value = await useFetch(
    () =>
      `https://soccer.sportmonks.com/api/v2.0/leagues?api_token=yJa5UcHQ0V22MXG9wlpQ3vtf8ucr6GzJJdd0IShA2j5wOSatggY783JolO6J`
  );
});
const getLeagueId = (id) => {
  allLeagues.value = !allLeagues;
  navigateTo(`/${id}-standings`);
  showmenu.value = false;
};

const toggleDropdown = () => {
  allLeagues.value = !allLeagues.value;
};
const toggleMenue = function () {
  showmenu.value = !showmenu.value;
};
const goto = (value) => {
  console.log(value);
  // navigateTo(`auth/${value}`);
};
</script>
<template>
  <div
    class="flex h-16 lg:h-18 bg-[#0d406a] text-white px-2 md:px-8 md:text-xs lg:text-sm"
  >
    <div class="self-center">
      <a href="/"> <img src="@/assets/fb-logo.png" alt="logo" /></a>
    </div>
    <div
      class="self-center relative hidden md:flex md:items-center text-[1.1rem]"
    >
      <a
        href=""
        class="text-white px-4 py-3 leading-4 duration-100 hover:bg-[#024c8a]"
        >Home</a
      >
      <div class="relative">
        <div
          class="flex text-white px-4 py-2 hover:bg-[#024c8a] cursor-pointer"
          @click="toggleDropdown()"
        >
          <span class="mr-4"> Leagues </span>
          <svg
            class="fill-white w-[1.5rem] self-center"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"
            />
          </svg>
        </div>
        <div
          v-if="allLeagues && leagues.data"
          class="absolute bg-gray-300 text-black mt-2 w-64 rounded"
        >
          <span v-for="l in leagues.data.data" :key="l.id">
            <a
              @click="getLeagueId(l.current_season_id)"
              class="flex items-center border bg-white cursor-pointer rounded p-3 hover:text-[#0d406a] hover:bg-gray-200"
            >
              <img :src="l.logo_path" class="h-7 mr-3" alt="logo" />
              <span class="font-bold">{{ l.name }}</span>
            </a>
          </span>
        </div>
      </div>
      <a
        href=""
        class="text-white px-4 py-3 leading-4 duration-100 hover:bg-[#024c8a]"
        >Blogs</a
      >

      <!-- <div class=""></div> -->
    </div>
    <div class="ml-auto flex self-center">
      <button
        class="invisible md:visible text-white mr-3 font-medium text-sm md:text-base sm:text-[10px]"
        @click="goto('login')"
      >
        Login
      </button>
      <button
        class="relative invisible md:visible inline-flex items-center px-4 py-2 border border-white font-medium rounded-md text-white shadow-sm hover:bg-white hover:text-[#0d406a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm md:text-base"
        @click="goto('register')"
      >
        Sign Up
      </button>
      <button class="ml-4 md:hidden flex" @click="toggleMenue()">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="self-center h-6 w-6 lg:w-8 lg:h-8 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      </button>
    </div>
  </div>

  <div
    class="fixed w-full h-full top-0 flex z-50 overflow-y-scroll"
    v-if="showmenu"
  >
    <div class="w-4/5 h-full bg-[#0d406a]">
      <div class="mb-5">
        <a href="/">
          <img src="@/assets/fb-logo.png" class="h-12 p-2" alt="logo"
        /></a>
      </div>

      <div class="pl-2 text-white">
        <div class="flex">
          <a href="" class="text-white py-3 leading-4 duration-100">Home</a>
        </div>

        <!-- <a href="" class="text-white px-4 py-3 leading-4 duration-100"
            >Leagues</a
          > -->
        <div class="relative">
          <div
            class="flex text-white py-2 hover:bg-[#024c8a] cursor-pointer"
            @click="toggleDropdown()"
          >
            <span class="mr-4"> Leagues </span>
            <svg
              class="fill-white w-[1.5rem] self-center"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"
              />
            </svg>
          </div>
          <div
            v-if="allLeagues && leagues.data"
            class="absolute h-96 bg-gray-300 text-black mt-2 rounded overflow-y-scroll"
          >
            <span v-for="l in leagues.data.data" :key="l.id">
              <a
                @click="getLeagueId(l.current_season_id)"
                class="flex items-center border bg-white rounded p-3 cursor-pointer hover:text-[#0d406a] hover:bg-gray-200"
              >
                <img :src="l.logo_path" class="h-7 mr-3" alt="logo" />
                <span class="font-bold">{{ l.name }}</span>
              </a>
            </span>
          </div>
        </div>

        <div class="flex">
          <a href="/" class="w-full text-white py-3 leading-4 duration-100"
            >About</a
          >
        </div>
      </div>
    </div>
    <div
      class="w-1/5 h-full bg-slate-200 opacity-70"
      @click="toggleMenue()"
    ></div>
  </div>

  <!-- <div
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
        </div> -->
</template>
