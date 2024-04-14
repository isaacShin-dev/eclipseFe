<script setup >
import { ref, onMounted, onUnmounted} from 'vue'
import 'public/styles/reset.css'
import 'public/styles/common.css'
import LangSwitcher from "~/components/appLayouts/LangSwitcher.vue";
import { useTheme } from 'vuetify'
const { locale } = useI18n();
const accountStore = useAccountStore()

const localePath = useLocalePath()
const head = useLocaleHead({
  title: '클래스 매니저',
  meta: [],
  addSeoAttributes: true,
})
const htmlAttrs = computed(() => head.value.htmlAttrs)
const commonStore = useCommonStore()
const theme = useTheme();
const current_path = ref(useRoute().fullPath)

const drawer = ref(false);
const dialog = ref(false);
const loginStatus = ref(false);
const languages = ref([]);
const lang = ref('en');
const menuItems = ref(commonStore.menus);
const items = [
  { title: 'Profile' },
  { title: 'Logout' },
];
const resetAndSetCurrent = (selectedItem => {
  console.log('selectedItem', selectedItem);
  menuItems.value.forEach(item => {
    item.current = false;
  });
  selectedItem.current = true;
});


const route_to = (path) => {
  commonStore.route_to(path);
};
const toggleTheme = () => {
  const newTheme = theme.global.name.value === 'dark' ? 'light' : 'dark';
  theme.global.name.value = newTheme;
  localStorage.setItem('theme', newTheme);
  commonStore.theme = newTheme;
};
const openDialogOnCommandK = (event) => {
  if (event.metaKey && event.key.toLowerCase() === 'k') {
    dialog.value = true;
  }
};

const logout = () => {
  accountStore.clearSession();
};

const menuMouseOver = () => {
  console.log('item');
};

onMounted(() => {
  window.addEventListener('keydown', openDialogOnCommandK);
  const preferTheme = localStorage.getItem('theme');
  if (preferTheme) {
    theme.global.name.value = preferTheme;
    commonStore.theme = preferTheme;
  }
  const item = menuItems.value.find(item => locale + '/' + item.to === current_path.value.substring(3));
  if (item) resetAndSetCurrent(item);
});

onUnmounted(() => {
  window.removeEventListener('keydown', openDialogOnCommandK)
});

//watchers
watch(() => useRoute().fullPath, (newPath) => {current_path.value = newPath;});

watch(current_path, (to, from) => {
  console.log('to', to);
  const toSub = to.substring(3);
  if(toSub === '/account/login' || toSub === '/account/register' ||
      toSub === '/account/login' || toSub === '/account/register'){
    console.log('to === /account/login');
    menuItems.value.forEach(item => {item.current = false;});
  }
  if(to === '/' + locale.value){
    console.log('to === /' + locale.value);
    const item = menuItems.value.find(item => item.to === '/');
    if (item) resetAndSetCurrent(item);

  }
  const item = menuItems.value.find(item => item.to === to.substring(3));
  console.log('item', to.substring(3));
  if (item) resetAndSetCurrent(item);


});
</script>
<template>
  <Html :lang="htmlAttrs.lang">
    <v-app>
      <v-navigation-drawer v-model="drawer" mobile-breakpoint="md" class="height-75" :floating="true"
                           :scrim="true" elevation="0" style="z-index: 1009 !important;"
                           :color="theme.global.name.value === 'dark' ? '#3A3A39' : '#FFFEFC'"

      >
        <v-row align-content="center" justify="center" class="logo-responsive">
          <v-col cols="4" style="cursor: pointer;">
            <v-img src="/img/logo.png" class="app-logo-img"  @click="route_to('/')"/>
          </v-col>
          <v-col cols="8" align-self="center" @click="route_to('/')" style="cursor: pointer;">
            <v-list-item-title class="text-h5 main-title">이클립스</v-list-item-title>
            <v-list-item-subtitle>우리만의 클래스 매니저</v-list-item-subtitle>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-list density="compact">
          <div v-for="(item, idx) in menuItems" :key="item.id" class="">
            <NuxtLink v-if="item.type === 'link'" :to="localePath(item.to)"
               class="link-padding text-subtitle-2 list-item-cursor"  :class="{ 'current': item.current }">
              <v-icon size="x-small" class="ml-1 mr-3">{{item.icon}}</v-icon>{{ $t(`menu.${item.title}`)}}
            </NuxtLink>
            <NuxtLink v-else-if="item.type === 'request'" :to="localePath(item.to)"
               class="link-padding text-subtitle-2 list-item-cursor pl-4" :class="{ 'current': item.current }">
              {{ $t(`menu.${item.title}`)}}
              <v-chip :color="item.color" class="ml-2" size="x-small">{{item.method}}</v-chip>
            </NuxtLink>
            <p v-if="item.type === 'subMenu'" class="text-subtitle-1 sub-menu-title">
              {{ $t(`menu.${item.title}`)}}
            </p>
            <v-divider v-if="item.type === 'subMenu'" class="w-75 ml-5 border-opacity-100 mb-4"/>
          </div>
        </v-list>
      </v-navigation-drawer>

        <v-app-bar :floating="true" elevation="0" style="z-index: 1010 !important;" density="compact"
                   :color="theme.global.name.value === 'dark' ? '#3A3A39' : '#FFFEFC'">
            <v-app-bar-nav-icon slim density="compact" @click="drawer=!drawer"></v-app-bar-nav-icon>
<!--          <lang-switcher/>-->
          <v-row class="d-md-none d-sm-flex d-lg-none d-xl-none mt-0 mr-8" justify="center" align="center" align-content="center">
<!--          <v-col class="h6 text-center text-decoration-underline text-subtitle-2" style="letter-spacing: 5px !important;">이클립스</v-col>-->
          </v-row>
          <template v-slot:append>
<!--          <v-btn icon @click="dialog=true" size="small" class="d-md-flex"><v-icon>mdi-magnify</v-icon></v-btn>-->
            <v-btn icon @click="toggleTheme" size="small" class="d-md-flex"><v-icon>mdi-theme-light-dark</v-icon></v-btn>
            <NuxtLink v-if="!accountStore.isLogged" :to="localePath('/account/login')">
              <v-btn  icon  size="small" class=""><v-icon>mdi-login</v-icon></v-btn>
            </NuxtLink>
            <NuxtLink v-else>
              <v-btn icon @click="logout" size="small" class=""><v-icon>mdi-logout</v-icon></v-btn>
            </NuxtLink>
          </template>
        </v-app-bar>
        <v-main class="background-color-light" :class="{'background-color-dark' : theme.global.name.value === 'dark'}">
            <v-container class="xlg-max-w" fluid>
              <NuxtLayout>
              <NuxtPage />
              </NuxtLayout>
            </v-container>
        </v-main>
        <v-footer :color="theme.global.name.value === 'dark' ? '#3A3A39' : '#FFFEFC'" app>
          <div class="footer-wrapper">
            <p class="text-caption"><span>&copy; 2021 Kickin. All rights reserved.</span></p>
            <p><span class="text-caption">Developed by Isaac Shin</span></p>
          </div>
        </v-footer>
    </v-app>
  </Html>
</template>

<style>

.background-color-light{
    background-color: #FFFEFC;
}
.background-color-dark{
    background-color: #3A3A39;
}

html {
  scroll-behavior: smooth;
  font-family: SUIT-Regular, sans-serif;
}

.app-logo-img{
  border-radius: 150%;
  width: 48px;
  margin:15px 15px ;
}

.main-title{
  font-weight: bolder !important;
  font-size: 1rem !important;
  letter-spacing: 5px !important;
}
.search-btn-k{
  font-size: 0.8rem !important;
  font-weight: bolder !important;
  letter-spacing: 1px !important;
  border-radius: 10%;
  padding: 1px 1px;
  background-color: #b5b5b5;
  margin: 0 3px;
}
.list-item-cursor{
  width: 100%;
  cursor: pointer;
  display: block;
}
.list-item-cursor:hover{
  color: #120d0d;
  background-color: #e1e0e0;
  border-radius: 6px;

}
.sub-menu-title{
  font-family: Pretendardvariable, sans-serif !important;
  margin-top: 26px;
  margin-left: 9px;
  padding-left: 10px;
  padding-bottom: 5px;
  font-size: 0.8rem !important;
  font-weight: 400 !important;
  letter-spacing: .7px !important;
  width: 56%;
}

@media (max-width: 600px) {
}
/*a {
  color: #c02828;
}*/
.height-75{
  z-index: 1 !important;
}

.link-padding{
  width: 90%;
  padding-left:2px;
  margin: 7px 0.2px 0 10px;
  letter-spacing: .2px !important;
  font-family: SUIT-Regular, sans-serif !important;
}
.current{
  border-radius: 6px;
  background-color: rgba(171, 167, 167, 0.18) !important;
}

@media (max-width: 959px) {
  .logo-responsive{
    margin-top: 3.75rem !important;
  }
}
.app-logo-img{
    border-radius: 150%;
    width: 48px;
    margin:15px 15px ;
}
. margin-left{
    margin-left: 10rem;

}
.main-title{
    font-weight: bolder !important;
    font-size: .9rem !important;
    letter-spacing: 5px !important;
}
.footer-wrapper{
  width: 100%;
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  justify-content: space-between;
  justify-items: center;
  padding: 0 2rem;

}
@media (max-width: 600px) {
    .xlg-max-w{
        max-width: 80% !important;
    }
}
@media (max-width: 959px) {
.logo-responsive{
  margin-top: 3.75rem !important;
    }
}

</style>