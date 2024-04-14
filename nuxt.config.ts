import { defineNuxtConfig } from 'nuxt/config'
export default defineNuxtConfig({
    runtimeConfig: {
        public: {
            API_BASE_URL: process.env.API_MODE === 'development' ? 'http://localhost:8000/' : 'https://devinsight.kr/',
        },
    },
  devtools: { enabled: true },
    modules: [
        '@invictus.codes/nuxt-vuetify',
        '@pinia/nuxt',
        '@pinia-plugin-persistedstate/nuxt',
        '@nuxtjs/i18n',
    ],
    routeRules: {
        "/": { redirect: "/kr" },
},
    i18n: {
        vueI18n: './i18n.config.ts',
        locales: [
            // {
            //     code: 'en',
            //     iso: 'en-US',
            //     file: './language/en-US.ts',
            // },
            {
                code: 'kr',
                iso: 'ko-KR',
                file: './language/ko-KR.ts',
            },

        ],
        defaultLocale: 'en',
        strategy: 'prefix',
        detectBrowserLanguage: false,
    },
    pinia: {
        storesDirs: ['./stores/**'],
    },
    vuetify: {
        vuetifyOptions: {
        },
        moduleOptions: {
            // styles: { configFile: 'assets/variables.scss'},
            /* nuxt-vuetify module options */
            treeshaking: true,
            useIconCDN: true,

            /* vite-plugin-vuetify options */
            autoImport: true,
            useVuetifyLabs: true,
        },

    },
    piniaPersistedstate: {
        cookieOptions: {
            sameSite: 'strict',
        },
        storage: 'localStorage'
    },
})
