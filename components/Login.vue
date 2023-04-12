<script setup>
const gotoRegister = (value) => {
  if (value === "register") {
    navigateTo("/auth/register");
  }
  if (value === "home") {
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
        Login
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
        <button
          class="w-full rounded bg-[#0d406a] py-2 md:text-2xl text-white"
          aria-label="login"
          @click="gotoRegister('home')"
        >
          Login
          <!-- <a href="/"> Login </a> -->
        </button>
        <div class="text-center mt-8">
          Do not have an account yet?
          <a @click="gotoRegister('register')" class="border-b-2 cursor-pointer"
            >Register</a
          >
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
