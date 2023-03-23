<script setup>
const route = useRoute();

const { data: teams, error: testError } = useFetch(
  `https://soccer.sportmonks.com/api/v2.0/standings/season/${route.params.season}?api_token=yJa5UcHQ0V22MXG9wlpQ3vtf8ucr6GzJJdd0IShA2j5wOSatggY783JolO6J&include=standings.team`
);

const goto = function (team) {
  navigateTo(`/teamStats-${team}`);
};
</script>

<template>
  <div class="w-9/10 md:w-4/5 mx-auto">
    <!-- add section -->
    <div
      class="bg-rose-500 text-white rounded-lg py-2 px-2 my-5 transition delay-150 duration-300 ease-in-out"
    >
      <div class="flex justify-between py-5">
        <p class="text-3xl">Ad display here</p>
      </div>
    </div>
    <!-- add section -->

    <!-- <div v-if="teams">
      <div class="grid grid-cols-8 gap-2 shadow-0">
        <div class="p-1">Logo</div>
        <div class="p-1">Name</div>
        <div class="p-1">Played</div>
        <div class="p-1">Won</div>
        <div class="p-1">Draw</div>
        <div class="p-1">Lost</div>
        <div class="p-1">Goal Scored</div>
        <div class="p-1">Points</div>
      </div>
      <div
        class="grid grid-cols-8 p-2 gap-2 border mb-2 hover:bg-slate-300 hover:cursor-pointer"
        v-for="team in teams.data[0].standings.data"
        :key="team.team_id"
        @click="goto(team.team_id)"
      >
        <div class="p-1 self-center">
          <img :src="team.team.data.logo_path" class="w-10" alt="" />
        </div>

        <div class="p-1 self-center">{{ team.team_name }}</div>
        <div class="p-1 self-center">{{ team.overall.games_played }}</div>
        <div class="p-1 self-center">{{ team.overall.won }}</div>
        <div class="p-1 self-center">{{ team.overall.draw }}</div>
        <div class="p-1 self-center">{{ team.overall.lost }}</div>
        <div class="p-1 self-center">{{ team.overall.goals_scored }}</div>
        <div class="p-1 self-center">{{ team.total.points }}</div>
      </div>
    </div>
    <div v-else>
      {{ testError }}
    </div> -->

    <div v-if="teams">
      <table class="w-full">
        <thead class="text-start py-4 md:visible invisible">
          <th class="text-start"><span class="invisible">logo</span></th>
          <th class="text-start"></th>
          <th class="text-start">Played</th>
          <th class="text-start">Won</th>
          <th class="text-start">Draw</th>
          <th class="text-start">Lost</th>
          <th class="text-start">Goal Scored</th>
          <th class="text-start">Points</th>
        </thead>
        <thead class="text-start py-4 visible md:invisible">
          <th class="text-start"><span class="invisible">logo</span></th>
          <th class="text-start"></th>
          <th class="text-start">P</th>
          <th class="text-start">W</th>
          <th class="text-start">D</th>
          <th class="text-start">L</th>
          <th class="text-start">G</th>
          <th class="text-start">Pts</th>
        </thead>
        <tbody
          v-for="team in teams.data[0].standings.data"
          :key="team.team_id"
          @click="goto(team.team_id)"
          class="border cursor-pointer"
        >
          <td>
            <img :src="team.team.data.logo_path" class="h-6 w-6 mx-auto" alt="logo" />
          </td>
          <td>{{ team.team_name }}</td>
          <td>{{ team.overall.games_played }}</td>
          <td>{{ team.overall.won }}</td>
          <td>{{ team.overall.draw }}</td>
          <td>{{ team.overall.lost }}</td>
          <td>{{ team.overall.goals_scored }}</td>
          <td>{{ team.total.points }}</td>
        </tbody>
      </table>
    </div>
    <div v-else>
      {{ testError }}
    </div>
  </div>
</template>
