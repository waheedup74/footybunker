<script setup>
// const { apiBase } = useRuntimeConfig();
const gotoLogin = (value) => {
  if (value === "login") {
    navigateTo("/auth/login");
  } else if (value === "home") {
    navigateTo("/");
  }
};
</script>
<template>
  <div class="flex flex-col h-screen justify-center items-center">
    <div
      class="w-10/12 md:w-3/12 flex flex-col justify-center items-center bg-white rounded border border-balck"
    >
      <div class="w-full text-center py-5 text-2xl md:text-3xl border-b-2">
        Register
      </div>
      <div class="my-10 px-5">
        <input
          class="mb-10 text-black md:text-xl w-full border-b-2 focus:outline-none focus:border-[#0d406a]"
          type="text"
          placeholder="Username"
        />
        <input
          class="mb-10 text-black md:text-xl w-full border-b-2 focus:outline-none focus:border-[#0d406a]"
          type="password"
          placeholder="Password"
        />
        <input
          class="mb-10 text-black md:text-xl w-full border-b-2 focus:outline-none focus:border-[#0d406a]"
          type="password"
          placeholder="Confirm password"
        />
        <button
          class="w-full rounded bg-[#0d406a] py-2 md:text-2xl text-white"
          aria-label="register"
          @click="gotoLogin('home')"
        >
          Signup
        </button>
        <div class="text-center mt-8">
          Already have an account?
          <a @click="gotoLogin('login')" class="border-b-2 cursor-pointer"
            >Login</a
          >
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
