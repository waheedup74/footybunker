<script setup>
const route = useRoute();
const { addHyphen } = useUtilities();
let tab_id = ref("A");
const todayDate = ref("");
const dayName = ref("");
const fixtures = ref({});

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
// todayDate.value = "2023-02-7";

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

onBeforeMount(async () => {
  fixtures.value = await useFetch(
    () =>
      `https://soccer.sportmonks.com/api/v2.0/fixtures/date/${todayDate.value}?api_token=yJa5UcHQ0V22MXG9wlpQ3vtf8ucr6GzJJdd0IShA2j5wOSatggY783JolO6J&include=localTeam,visitorTeam,league.country&tz=BST`
  );
});

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

const viewDetails = function (localTeam, visitorTeam, fix_id) {
  navigateTo(`${addHyphen(localTeam)}-vs-${addHyphen(visitorTeam)}-${fix_id}`);
};

const teamStats = (teamName, team_id) => {
  navigateTo(`${addHyphen(teamName)}-stats-${team_id}`);
};
</script>

<template>
  <div class="w-9/10 md:w-4/5 mx-auto p-5">
    <!-- add section -->
    <div
      class="bg-rose-500 text-white rounded-lg py-2 px-2 mb-5 transition delay-150 duration-300 ease-in-out"
    >
      <div class="flex justify-between py-5">
        <p class="text-3xl">Ad display here</p>
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

    <div v-if="fixtures.data">
      <div v-if="fixtures.data.data.length !== 0">
        <div v-if="tab_id === 'A'">
          <div
            class="w-full border mb-3 shadow-lg hover:shadow-[#9acaf1]"
            v-for="f in fixtures.data.data"
          >
            <div class="flex p-2">
              <div class="self-center mr-2 md:mr-6">
                <img
                  :src="f.league.data.logo_path"
                  class="w-10"
                  :alt="f.league.data.name"
                />
              </div>

              <div class="self-center mr-2 md:mr-6">
                <p class="text-sm">{{ f.time.starting_at.time.slice(0, 5) }}</p>
              </div>

              <div class="w-full self-center mr-5">
                <div class="flex justify-between mb-3">
                  <img
                    :src="f.localTeam.data.logo_path"
                    class="w-4 h-4 md:w-6 md:h-6 mr-2"
                    alt="logo"
                  />
                  <a
                    class="text-sm hover:underline decoration-1 cursor-pointer"
                    @click="teamStats(f.localTeam.data.name, f.localteam_id)"
                  >
                    {{ f.localTeam.data.name }}</a
                  >

                  <div class="ml-auto text-sm self-center">
                    {{ f.scores.localteam_score }}
                  </div>
                </div>
                <div class="flex justify-between">
                  <img
                    :src="f.visitorTeam.data.logo_path"
                    class="w-4 h-4 md:w-6 md:h-6 mr-2"
                    alt="logo"
                  />
                  <a
                    class="text-sm hover:underline decoration-1 cursor-pointer"
                    @click="
                      teamStats(f.visitorTeam.data.name, f.visitorteam_id)
                    "
                    >{{ f.visitorTeam.data.name }}</a
                  >

                  <div class="ml-auto text-sm self-center">
                    {{ f.scores.visitorteam_score }}
                  </div>
                </div>
              </div>
              <div class="self-center">
                <button
                  class="py-1 px-4 text-sm border rounded hover:bg-[#0d406a] hover:text-white"
                  @click="
                    viewDetails(
                      f.localTeam.data.name,
                      f.visitorTeam.data.name,
                      f.id
                    )
                  "
                >
                  Preview
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="tab_id === 'B'">
          <div
            class="w-full border mb-3 shadow-lg hover:shadow-[#9acaf1]"
            v-for="f in fixtures.data.data"
          >
            <div class="flex p-2">
              <div class="self-center mr-2 md:mr-6">
                <img
                  :src="f.league.data.logo_path"
                  class="w-10"
                  :alt="f.league.data.name"
                />
              </div>

              <div class="self-center mr-2 md:mr-6">
                <p class="text-sm">{{ f.time.starting_at.time.slice(0, 5) }}</p>
              </div>

              <div class="w-full self-center mr-5">
                <div class="flex justify-between mb-3">
                  <img
                    :src="f.localTeam.data.logo_path"
                    class="w-4 h-4 md:w-6 md:h-6 mr-2"
                    alt="logo"
                  />
                  <a
                    class="text-sm hover:underline decoration-1 cursor-pointer"
                    @click="teamStats(f.localTeam.data.name, f.localteam_id)"
                  >
                    {{ f.localTeam.data.name }}</a
                  >

                  <div class="ml-auto text-sm self-center">
                    {{ f.scores.localteam_score }}
                  </div>
                </div>
                <div class="flex justify-between">
                  <img
                    :src="f.visitorTeam.data.logo_path"
                    class="w-4 h-4 md:w-6 md:h-6 mr-2"
                    alt="logo"
                  />
                  <a
                    class="text-sm hover:underline decoration-1 cursor-pointer"
                    @click="
                      teamStats(f.visitorTeam.data.name, f.visitorteam_id)
                    "
                    >{{ f.visitorTeam.data.name }}</a
                  >

                  <div class="ml-auto text-sm self-center">
                    {{ f.scores.visitorteam_score }}
                  </div>
                </div>
              </div>
              <div class="self-center">
                <button
                  class="py-1 px-4 text-sm border rounded hover:bg-[#0d406a] hover:text-white"
                  @click="
                    viewDetails(
                      f.localTeam.data.name,
                      f.visitorTeam.data.name,
                      f.id
                    )
                  "
                >
                  Preview
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="tab_id === 'C'">
          <div
            class="w-full border mb-3 shadow-lg hover:shadow-[#9acaf1]"
            v-for="f in fixtures.data.data"
          >
            <div class="flex p-2">
              <div class="self-center mr-2 md:mr-6">
                <img
                  :src="f.league.data.logo_path"
                  class="w-10"
                  :alt="f.league.data.name"
                />
              </div>

              <div class="self-center mr-2 md:mr-6">
                <p class="text-sm">{{ f.time.starting_at.time.slice(0, 5) }}</p>
              </div>

              <div class="w-full self-center mr-5">
                <div class="flex justify-between mb-3">
                  <img
                    :src="f.localTeam.data.logo_path"
                    class="w-4 h-4 md:w-6 md:h-6 mr-2"
                    alt="logo"
                  />
                  <a
                    class="text-sm hover:underline decoration-1 cursor-pointer"
                    @click="teamStats(f.localTeam.data.name, f.localteam_id)"
                  >
                    {{ f.localTeam.data.name }}</a
                  >

                  <div class="ml-auto text-sm self-center">
                    {{ f.scores.localteam_score }}
                  </div>
                </div>
                <div class="flex justify-between">
                  <img
                    :src="f.visitorTeam.data.logo_path"
                    class="w-4 h-4 md:w-6 md:h-6 mr-2"
                    alt="logo"
                  />
                  <a
                    class="text-sm hover:underline decoration-1 cursor-pointer"
                    @click="
                      teamStats(f.visitorTeam.data.name, f.visitorteam_id)
                    "
                    >{{ f.visitorTeam.data.name }}</a
                  >

                  <div class="ml-auto text-sm self-center">
                    {{ f.scores.visitorteam_score }}
                  </div>
                </div>
              </div>
              <div class="self-center">
                <button
                  class="py-1 px-4 text-sm border rounded hover:bg-[#0d406a] hover:text-white"
                  @click="
                    viewDetails(
                      f.localTeam.data.name,
                      f.visitorTeam.data.name,
                      f.id
                    )
                  "
                >
                  Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <p>No fixture data available</p>
      </div>
    </div>
  </div>
</template>

<style></style>
