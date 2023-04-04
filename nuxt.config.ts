export default {
    // ssr: false,
    // generate: {
    //   fallback: "custom_sap_fallbackpage.html"
    // },
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
    runtimeConfig: {
      public: {
        apiBase: process.env.NUXT_API_SECRET
      }
    }
  }

