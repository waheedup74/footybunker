export default {
  ssr: false,
  // generate: {
  //   fallback: "custom_sap_fallbackpage.html"
  // },
  router: {
    base: '/your-dynamic-route/'
  },
  modules: [
    "@nuxtjs/tailwindcss",

  ],
  head: {
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      // <link rel="icon" type="image/x-icon" href="/images/favicon.ico">
    ],
    css: [
      "~/assets/css/global.css",
    ],
  },
  publicRuntimeConfig: {
    public: {
      apiKey: process.env.API_KEY
    }

  }
}

