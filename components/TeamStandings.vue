<script setup>
const route = useRoute();

const { addHyphen } = useUtilities();

const { data: teams, error: testError } = useFetch(
  `https://soccer.sportmonks.com/api/v2.0/standings/season/${route.params.season}?api_token=yJa5UcHQ0V22MXG9wlpQ3vtf8ucr6GzJJdd0IShA2j5wOSatggY783JolO6J&include=standings.team&tz=BST`
);

useHead({
  title: route.params.league.replace(/-/g, " ") + " " + "standings Betbuilder",
});

const goto = function (teamName, team_id) {
  navigateTo(`${addHyphen(teamName)}-stats-${team_id}`);
};
</script>

<template>
  <div class="w-9/10 md:w-4/5 mx-auto py-10">
    <!-- add section -->
    <div
      class="bg-rose-500 text-white rounded-lg py-2 px-2 my-5 transition delay-150 duration-300 ease-in-out"
    >
      <div class="flex justify-between py-5">
        <p class="text-3xl">Ad display here</p>
      </div>
    </div>
    <!-- add section -->

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
        <tbody>
          <tr
            v-for="team in teams.data[0]?.standings.data"
            :key="team.team_id"
            @click="goto(team.team_name, team.team_id)"
            class="border cursor-pointer py-4"
          >
            <td>
              <img
                :src="team.team.data.logo_path"
                class="h-6 w-6 mx-auto"
                alt="logo"
              />
            </td>
            <td>{{ team.team_name }}</td>
            <td>{{ team.overall.games_played }}</td>
            <td>{{ team.overall.won }}</td>
            <td>{{ team.overall.draw }}</td>
            <td>{{ team.overall.lost }}</td>
            <td>{{ team.overall.goals_scored }}</td>
            <td>{{ team.total.points }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      {{ testError }}
    </div>
  </div>
</template>

<style scoped>
tbody td {
  padding: 10px 0;
}
</style>
