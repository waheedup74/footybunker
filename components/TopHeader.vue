<script setup>
const allLeagues = ref(false);
const leagues = ref({});
const showmenu = ref(false);
const { addHyphen } = useUtilities();
onBeforeMount(async () => {
  leagues.value = await useFetch(
    () =>
      `https://soccer.sportmonks.com/api/v2.0/leagues?api_token=yJa5UcHQ0V22MXG9wlpQ3vtf8ucr6GzJJdd0IShA2j5wOSatggY783JolO6J`
  );
});
const getLeagueId = (league, id) => {
  allLeagues.value = !allLeagues;
  navigateTo(`/${addHyphen(league)}-standings-${id}`);
  // navigateTo(`/${id}-standings`);
  console.log("what do you got", addHyphen(league), id);
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
  navigateTo(`/auth/${value}`);
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
      <div>
        <a
          href="/"
          class="text-white px-4 py-3 leading-4 duration-100 hover:bg-[#024c8a]"
          >Home</a
        >
      </div>

      <div class="relative">
        <div
          class="flex text-white px-4 py-3 hover:bg-[#024c8a] cursor-pointer"
          @click="toggleDropdown()"
        >
          <div class="mr-4">Leagues</div>
          <div class="self-center">
            <svg
              class="fill-white w-[1.1rem] self-center"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"
              />
            </svg>
          </div>
        </div>
        <div
          v-if="allLeagues && leagues.data"
          class="absolute bg-gray-300 text-black mt-2 w-64 rounded"
        >
          <span v-for="l in leagues.data.data" :key="l.id">
            <a
              @click="getLeagueId(l.name, l.current_season_id)"
              class="flex items-center border bg-white cursor-pointer rounded p-3 hover:text-[#0d406a] hover:bg-gray-200"
            >
              <img :src="l.logo_path" class="h-7 mr-3" alt="logo" />
              <span class="font-bold">{{ l.name }}</span>
            </a>
          </span>
        </div>
      </div>
      <div>
        <a
          href="/"
          class="text-white px-4 py-3 leading-4 duration-100 hover:bg-[#024c8a]"
          >Blogs</a
        >
      </div>

      <!-- <div class=""></div> -->
    </div>
    <div class="ml-auto flex self-center">
      <button
        class="invisible md:visible text-white mr-3 font-medium text-sm md:text-base sm:text-[10px]"
        aria-label="login"
        @click="goto('login')"
      >
        Login
      </button>
      <button
        class="relative invisible md:visible inline-flex items-center px-4 py-2 border border-white font-medium rounded-md text-white shadow-sm hover:bg-white hover:text-[#0d406a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm md:text-base"
        aria-label="register"
        @click="goto('register')"
      >
        Sign Up
      </button>
      <button
        class="ml-4 md:hidden flex"
        aria-label="leagues"
        @click="toggleMenue()"
      >
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
            >Blogs</a
          >
        </div>

        <div class="flex">
          <a
            href="/auth/login"
            class="w-full text-white py-3 leading-4 duration-100"
            >Login</a
          >
        </div>

        <div class="flex">
          <a
            href="/auth/register"
            class="w-full text-white py-3 leading-4 duration-100"
            >Register</a
          >
        </div>
      </div>
    </div>
    <div
      class="w-1/5 h-full bg-slate-200 opacity-70"
      @click="toggleMenue()"
    ></div>
  </div>
</template>
