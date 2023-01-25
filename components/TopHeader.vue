<script setup>
const allLeagues = ref(false)
</script>
<template>
    <div class="flex h-16 lg:h-18 bg-[#0d406a] text-white px-8">
        <div class="self-center">
            <img src="@/assets/fb-logo.png" alt="">
        </div>
        <div class="self-center relative hidden lg:flex md:items-center text-[1.1rem]">
            <a href="" class="text-white px-4 py-3 leading-4 duration-100 hover:bg-[#024c8a]">Home</a>
            <div class="relative">
                <div class="flex text-white px-4 py-2 hover:bg-[#024c8a] cursor-pointer"
                    @click="allLeagues = !allLeagues">
                    <span class="mr-4"> Leagues </span>
                    <svg class="fill-white w-[1.5rem] self-center" xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24">
                        <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                    </svg>
                </div>
                <div v-if="allLeagues" class="absolute bg-gray-300 text-black mt-2 w-64 rounded">
                    <a href="/"
                        class="flex items-center border bg-white rounded p-3 hover:text-[#0d406a] hover:bg-gray-200">
                        <img src="https://cdn.sportmonks.com/images/soccer/leagues/8/8.png" class="h-7 mr-3" alt="">
                        <span class="font-bold">Premier League</span>
                    </a>
                    <a href="/"
                        class="flex items-center border bg-white rounded p-3 hover:text-[#0d406a] hover:bg-gray-200">
                        <img src="https://cdn.sportmonks.com/images/soccer/leagues/564.png" class="h-7 mr-3" alt="">
                        <span class="font-bold">La Liga</span>
                    </a>
                    <a href="/"
                        class="flex items-center border bg-white rounded p-3 hover:text-[#0d406a] hover:bg-gray-200">
                        <img src="https://cdn.sportmonks.com/images/soccer/leagues/82.png" class="h-7 mr-3" alt="">
                        <span class="font-bold">Bundesliga</span>
                    </a>
                    <a href="/"
                        class="flex items-center border bg-white rounded p-3 hover:text-[#0d406a] hover:bg-gray-200">
                        <img src="https://cdn.sportmonks.com/images//soccer/leagues/13/301.png" class="h-7 mr-3" alt="">
                        <span class="font-bold">Ligue 1</span>
                    </a>
                    <a href="/"
                        class="flex items-center border bg-white rounded p-3 hover:text-[#0d406a] hover:bg-gray-200">
                        <img src="https://cdn.sportmonks.com/images//soccer/leagues/0/384.png" class="h-7 mr-3" alt="">
                        <span class="font-bold">Serie A</span>
                    </a>
                </div>
            </div>
            <a href="" class="text-white px-4 py-3 leading-4 duration-100 hover:bg-[#024c8a]">Blogs</a>

            <!-- <div class=""></div> -->
        </div>
        <div class="ml-auto flex self-center">
            <button class="text-white mr-3 font-medium text-sm md:text-base sm:text-[10px]">Login</button>
            <button
                class="relative inline-flex items-center px-4 py-2 border border-white font-medium rounded-md text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm md:text-base">Sign
                Up</button>
            <button class="ml-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="self-center h-6 w-6 lg:w-8 lg:h-8 text-white" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16">
                    </path>
                </svg>
            </button>
        </div>
    </div>
</template>
