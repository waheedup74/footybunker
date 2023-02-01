<script setup>
import { ref } from "vue";

const route = useRouter();
const { data: teams, error: testError } = useFetch(
  "https://soccer.sportmonks.com/api/v2.0/standings/season/19734?api_token=yJa5UcHQ0V22MXG9wlpQ3vtf8ucr6GzJJdd0IShA2j5wOSatggY783JolO6J"
);

const goto = function (team) {
  navigateTo(`/team-${team}`);
};

// console.log(route.params);
</script>

<template>
  <h1 class="text-center text-3xl pt-3 pb-5 bg-red-300">
    This is team standing page
  </h1>
  <div class="px-6" v-if="teams">
    <div class="grid grid-cols-8 gap-2 shadow-0">
      <div class="border-b p-1">Position</div>
      <div class="border-b p-1">Name</div>
      <div class="border-b p-1">Played</div>
      <div class="border-b p-1">Won</div>
      <div class="border-b p-1">Draw</div>
      <div class="border-b p-1">Lost</div>
      <div class="border-b p-1">Goal Scored</div>
      <div class="border-b p-1">Points</div>
    </div>
    <div
      class="grid grid-cols-8 gap-2 hover:bg-blue-300 hover:cursor-pointer"
      v-for="team in teams.data[0].standings.data"
      :key="team.team_id"
      @click="goto(team.team_id)"
    >
      <div class="border-t border-b p-1">{{ team.position }}</div>
      <div class="border-t border-b p-1">{{ team.team_name }}</div>
      <div class="border-t border-b p-1">{{ team.overall.games_played }}</div>
      <div class="border-t border-b p-1">{{ team.overall.won }}</div>
      <div class="border-t border-b p-1">{{ team.overall.draw }}</div>
      <div class="border-t border-b p-1">{{ team.overall.lost }}</div>
      <div class="border-t border-b p-1">{{ team.overall.goals_scored }}</div>
      <div class="border-t border-b p-1">{{ team.total.points }}</div>
    </div>
  </div>
</template>
