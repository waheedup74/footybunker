<script setup>
const route = useRoute();
let tab_id = ref("A");
const todayDate = ref("");
const dayName = ref("");

let today = new Date();
let dayAfterTomorrow = new Date(today);
dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
dayName.value = days[dayAfterTomorrow.getDay()];
let dd = String(today.getDate()).padStart(2, "0");
let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
let yyyy = today.getFullYear();

todayDate.value = yyyy + "-" + mm + "-" + dd;

function getDates(day) {
  if (day === "today") {
    let today = new Date();

    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    let yyyy = today.getFullYear();

    todayDate.value = yyyy + "-" + mm + "-" + dd;
  } else if (day === "tomorrow") {
    let today = new Date();
    let tomorrow = new Date(today);

    tomorrow.setDate(tomorrow.getDate() + 1);
    let dd = String(tomorrow.getDate()).padStart(2, "0");
    let mm = String(tomorrow.getMonth() + 1).padStart(2, "0"); //January is 0!
    let yyyy = tomorrow.getFullYear();
    todayDate.value = yyyy + "-" + mm + "-" + dd;
  } else if (day === "datomorrow") {
    let today = new Date();
    let dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    let dd = String(dayAfterTomorrow.getDate()).padStart(2, "0");
    let mm = String(dayAfterTomorrow.getMonth() + 1).padStart(2, "0"); //January is 0!
    let yyyy = dayAfterTomorrow.getFullYear();

    todayDate.value = yyyy + "-" + mm + "-" + dd;
  }
}

// GET Team fixture stats using and Team Id and range of dates
const { data: features, error: featuresError } = useFetch(
  () =>
    `https://soccer.sportmonks.com/api/v2.0/fixtures/date/${todayDate.value}?api_token=yJa5UcHQ0V22MXG9wlpQ3vtf8ucr6GzJJdd0IShA2j5wOSatggY783JolO6J&include=localTeam,visitorTeam,league.country`
);
const goto = function (league) {
  navigateTo(`/${league}-standings`);
};

const changeTabs = function (tab, day) {
  if (day === "today") {
    getDates("today");
    tab_id.value = tab;
  } else if (day === "tomorrow") {
    getDates("tomorrow");
    tab_id.value = tab;
  } else if (day === "datomorrow") {
    getDates("datomorrow");
    tab_id.value = tab;
  }
};

const viewDetails = function (fix_id) {
  navigateTo(`match-${fix_id}`);
};

const teamStats = (team_id) => {
  navigateTo(`team-${team_id}`);
};
</script>

<template>
  <div class="mt-5 px-2 md:px-8">
    <!-- add section -->
    <div
      class="bg-rose-500 text-white rounded-lg py-2 px-2 mb-5 transition delay-150 duration-300 ease-in-out"
    >
      <div class="flex justify-between py-5">
        <p class="text-3xl">Add display here</p>
      </div>
    </div>
    <!-- add section -->
    <div class="w-full md:w-2/4">
      <div class="grid grid-cols-3 mb-6">
        <div
          @click="changeTabs('A', 'today')"
          :class="[
            tab_id === 'A' ? 'bg-[#0d406a] font-medium' : 'bg-[#1D8AE0]',
          ]"
          class="border py-2 cursor-pointer rounded-t-lg capitalize hover:bg-[#0d406a] text-white text-lg text-center"
        >
          Today
        </div>
        <div
          @click="changeTabs('B', 'tomorrow')"
          :class="[
            tab_id === 'B' ? 'bg-[#0d406a]  font-medium ' : 'bg-[#1D8AE0]',
          ]"
          class="border py-2 cursor-pointer rounded-t-lg capitalize hover:bg-[#0d406a] text-white text-lg text-center"
        >
          tomorrow
        </div>
        <div
          @click="changeTabs('C', 'datomorrow')"
          class="border py-2 cursor-pointer rounded-t-lg capitalize hover:bg-[#0d406a] text-white text-lg text-center"
          :class="[
            tab_id === 'C' ? 'bg-[#0d406a] font-medium' : 'bg-[#1D8AE0]',
          ]"
        >
          {{ dayName }}
        </div>
      </div>
    </div>

    <div v-if="features">
      <div v-if="tab_id === 'A'">
        <div
          class="w-full border mb-3 shadow-lg hover:shadow-[#9acaf1] cursor-pointer"
          v-for="f in features.data"
          @click="viewDetails(f.id)"
        >
          <div class="flex p-2">
            <div class="self-center mr-2">
              <img
                :src="f.league.data.logo_path"
                class="w-10"
                :alt="f.league.data.name"
              />
            </div>
            <div class="self-center mr-2">
              <p class="text-sm">{{ f.time.starting_at.time }}</p>
            </div>

            <div class="w-full self-center mr-5">
              <div class="flex justify-between">
                <div class="flex p-2">
                  <img
                    :src="f.localTeam.data.logo_path"
                    class="w-4 mr-2"
                    alt=""
                  />
                  <a class="text-sm" @click="teamStats(f.localteam_id)">
                    {{ f.localTeam.data.name }}</a
                  >
                </div>
                <div class="ml-auto text-sm self-center">
                  {{ f.scores.localteam_score }}
                </div>
              </div>
              <div class="flex justify-between">
                <div class="flex p-2">
                  <img
                    :src="f.visitorTeam.data.logo_path"
                    class="w-4 mr-2"
                    alt=""
                  />
                  <a class="text-sm" @click="teamStats(f.visitorteam_id)">{{
                    f.visitorTeam.data.name
                  }}</a>
                </div>
                <div class="ml-auto text-sm self-center">
                  {{ f.scores.visitorteam_score }}
                </div>
              </div>
            </div>

            <div class="self-center mr-5">
              <span
                v-if="
                  f.winner_team_id !== null && f.winner_team_id === localteam_id
                "
              >
                <img
                  :src="f.localTeam.data.logo_path"
                  :alt="f.localTeam.data.name"
                />
              </span>

              <span
                v-if="
                  f.winner_team_id !== null &&
                  f.winner_team_id === visitorteam_id
                "
              >
                <img
                  :src="f.visitorTeam.data.logo_path"
                  :alt="f.visitorTeam.data.name"
                />
              </span>

              <span class="text-sm" v-if="f.winner_team_id === null"> RP </span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="tab_id === 'B'">
        <div
          class="w-full border mb-3 shadow-lg hover:shadow-[#9acaf1] cursor-pointer"
          v-for="f in features.data"
          @click="viewDetails(f.id)"
        >
          <div class="flex p-2">
            <div class="self-center mr-2">
              <img
                :src="f.league.data.logo_path"
                class="w-10"
                :alt="f.league.data.name"
              />
            </div>
            <div class="self-center mr-2">
              <p class="text-sm">{{ f.time.starting_at.time }}</p>
            </div>

            <div class="w-full self-center mr-5">
              <div class="flex justify-between">
                <div class="flex p-2">
                  <img
                    :src="f.localTeam.data.logo_path"
                    class="w-4 mr-2"
                    alt=""
                  />
                  <a class="text-sm" @click="teamStats(f.localteam_id)">
                    {{ f.localTeam.data.name }}</a
                  >
                </div>
                <div class="ml-auto text-sm self-center">
                  {{ f.scores.localteam_score }}
                </div>
              </div>
              <div class="flex justify-between">
                <div class="flex p-2">
                  <img
                    :src="f.visitorTeam.data.logo_path"
                    class="w-4 mr-2"
                    alt=""
                  />
                  <a class="text-sm" @click="teamStats(f.visitorteam_id)">{{
                    f.visitorTeam.data.name
                  }}</a>
                </div>
                <div class="ml-auto text-sm self-center">
                  {{ f.scores.visitorteam_score }}
                </div>
              </div>
            </div>

            <div class="self-center mr-5">
              <span
                v-if="
                  f.winner_team_id !== null && f.winner_team_id === localteam_id
                "
              >
                <img
                  :src="f.localTeam.data.logo_path"
                  :alt="f.localTeam.data.name"
                />
              </span>

              <span
                v-if="
                  f.winner_team_id !== null &&
                  f.winner_team_id === visitorteam_id
                "
              >
                <img
                  :src="f.visitorTeam.data.logo_path"
                  :alt="f.visitorTeam.data.name"
                />
              </span>

              <span class="text-sm" v-if="f.winner_team_id === null"> RP </span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="tab_id === 'C'">
        <div
          class="w-full border mb-3 shadow-lg hover:shadow-[#9acaf1] cursor-pointer"
          v-for="f in features.data"
          @click="viewDetails(f.id)"
        >
          <div class="flex p-2">
            <div class="self-center mr-2">
              <img
                :src="f.league.data.logo_path"
                class="w-10"
                :alt="f.league.data.name"
              />
            </div>
            <div class="self-center mr-2">
              <p class="text-sm">{{ f.time.starting_at.time }}</p>
            </div>

            <div class="w-full self-center mr-5">
              <div class="flex justify-between">
                <div class="flex p-2">
                  <img
                    :src="f.localTeam.data.logo_path"
                    class="w-4 mr-2"
                    alt=""
                  />
                  <a class="text-sm" @click="teamStats(f.localteam_id)">
                    {{ f.localTeam.data.name }}</a
                  >
                </div>
                <div class="ml-auto text-sm self-center">
                  {{ f.scores.localteam_score }}
                </div>
              </div>
              <div class="flex justify-between">
                <div class="flex p-2">
                  <img
                    :src="f.visitorTeam.data.logo_path"
                    class="w-4 mr-2"
                    alt=""
                  />
                  <a class="text-sm" @click="teamStats(f.visitorteam_id)">{{
                    f.visitorTeam.data.name
                  }}</a>
                </div>
                <div class="ml-auto text-sm self-center">
                  {{ f.scores.visitorteam_score }}
                </div>
              </div>
            </div>

            <div class="self-center mr-5">
              <span
                v-if="
                  f.winner_team_id !== null && f.winner_team_id === localteam_id
                "
              >
                <img
                  :src="f.localTeam.data.logo_path"
                  :alt="f.localTeam.data.name"
                />
              </span>

              <span
                v-if="
                  f.winner_team_id !== null &&
                  f.winner_team_id === visitorteam_id
                "
              >
                <img
                  :src="f.visitorTeam.data.logo_path"
                  :alt="f.visitorTeam.data.name"
                />
              </span>

              <span class="text-sm" v-if="f.winner_team_id === null"> RP </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="mt-5 text-center">
    <a
      class="bg-green-400 py-3 px-6 mr-5 cursor-pointer"
      @click="goto('Premier-league')"
      >GoTo Premier league Standings
    </a>
  </div>
</template>

<style></style>

<!-- <div class="flex justify-between p-3 bg-gray-300">
            <div class="flex">
              <img
                :src="f.league.data.country.data.image_path"
                class="self-center w-4 h-3 mr-3"
                alt=""
              />
              <p class="mr-2">{{ f.league.data.country.data.name }}</p>
              <p>{{ f.league.data.name }}</p>
            </div>
            <p>Standings</p>
          </div> -->
