<script setup lang="ts">
import {onMounted} from "vue";

const { locale } = useI18n();
const current_lang = ref(locale);
const router = useRouter()
const commonStore = useCommonStore()
const switchLocalePath = useSwitchLocalePath()
const changeLocale = (lang: string) => {
  locale.value = lang;
  current_lang.value = lang;
  commonStore.lang = lang;
  localStorage.setItem('locale', lang);
  router.push(switchLocalePath(lang))
};
const currentReturn = computed(() => {
  return current_lang.value === 'kr' ? '🇰🇷 한국어' : '🇺🇸 English';
});

onMounted(() => {
  const locale = localStorage.getItem('locale');
  if (locale) {
    changeLocale(locale);
  }
});

</script>
<template>
  <div>
    <v-menu :no-click-animation="true"  open-on-hover :open-delay="105">
      <template v-slot:activator="{ props }">
        <v-btn  v-bind="props" style="font-size: 12px !important;"
                :ripple="false" density="compact" :flat="true" :slim="true" variant="plain">
          {{ currentReturn }}
          <v-icon class="mt-1">mdi-chevron-down</v-icon>
        </v-btn>
      </template>
      <v-list density="compact" style="font-size: 11px !important;">
        <v-list-item v-for="lang in $i18n.availableLocales" :key="lang" @click="changeLocale(lang)">
          <v-list-item-title style="font-size: 11px !important;">{{ lang === 'kr' ? '🇰🇷 한국어': '🇺🇸 English' }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>

</template>

<style scoped>

</style>