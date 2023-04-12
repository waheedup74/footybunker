<script setup>
const props = defineProps({
  allMatches: Array,
});
const { addHyphen } = useUtilities();

// const showDetails = (id) => {
//   navigateTo(`match-${id}`);
// };

const viewDetails = function (localTeam, visitorTeam, id) {
  navigateTo(`${addHyphen(localTeam)}-vs-${addHyphen(visitorTeam)}-${id}`);
};
</script>
<template>
  <div>
    <div
      class="flex justify-between p-2 my-2 text-sm bg-[#0d406a] text-white rounded"
    >
      <p>HEAD-TO-HEAD MATCHES</p>
    </div>

    <div v-if="allMatches.length">
      <div v-for="(match, index) in allMatches">
        <div
          class="flex justify-start mb-3 p-1 text-xs rounded border hover:bg-slate-300 hover:cursor-pointer"
          :class="index % 2 === 0 ? 'bg-slate-100' : ''"
        >
          <div class="self-center w-20">
            <p>{{ match.time.starting_at.date }}</p>
          </div>

          <div class="w-full mr-4">
            <div
              class="flex justify-between py-1"
              :class="[
                match.winner_team_id === match.localteam_id
                  ? 'font-bold'
                  : 'font-normal',
              ]"
            >
              <div class="flex justify-start">
                <img
                  :src="match.localTeam.data.logo_path"
                  class="w-6 self-center mr-2"
                  alt="logo"
                />
                <p class="self-center">{{ match.localTeam.data.name }}</p>
              </div>
              <div>
                <p class="self-center">{{ match.scores.localteam_score }}</p>
              </div>
            </div>
            <div
              class="flex justify-between py-1"
              :class="[
                match.winner_team_id === match.visitorteam_id
                  ? 'font-bold'
                  : 'font-normal',
              ]"
            >
              <div class="flex justify-start">
                <img
                  :src="match.visitorTeam.data.logo_path"
                  class="w-6 self-center mr-2"
                  alt="logo"
                />
                <p class="self-center">{{ match.visitorTeam.data.name }}</p>
              </div>
              <div>
                <p class="self-center">{{ match.scores.visitorteam_score }}</p>
              </div>
            </div>
          </div>

          <!--   <div class="self-center text-center">
            <button
              class="py-1 px-4 border rounded hover:bg-[#0d406a] hover:text-white"
              @click="
                viewDetails(
                  match.localTeam.data.name,
                  match.visitorTeam.data.name,
                  match.id
                )
              "
            >
              Preview
            </button>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
