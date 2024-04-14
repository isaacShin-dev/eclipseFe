<script setup lang="ts">
import PageSwitcher from "~/components/common/pageSwitcher.vue";

const localePath = useLocalePath()
const commonStore = useCommonStore()
const sectionVisibility = reactive({});

</script>

<template>
  <section class="gap-20 inner-wrapper" data-id="section1">
    <div class="main-intro">
      <v-icon size="x-large">mdi-laptop</v-icon>
      <div class="h2 text-center">
        {{ $t('page.home.section1.title') }}
      </div>
      <p class="h5 text-center">{{ $t('page.home.section1.content')}}</p>
      <v-btn color="#40557C" width="122" :to="localePath('/class/classInfo')">
        {{ $t('common.start')}}</v-btn>
    </div>
    <v-img src="/img/home-banner.png" class="banner-img" width="320" height="320"/>
  </section>
  <v-divider class="my-6 mx-14"/>
  <section class="gap-20 inner-wrapper-reverse" data-id="section2" :class="['fade-in', { 'visible': sectionVisibility['section2'] }]">
    <div class="main-intro">
      <v-icon size="x-large">mdi-teddy-bear</v-icon>
      <p class="h2 text-center">{{ $t('page.home.section2.title') }}</p>
      <p class="h5 text-center">{{ $t('page.home.section2.content')}}</p>
    </div>
    <v-img src="/img/baby.png" :width="322" :height="320"></v-img>
  </section>
  <v-divider class="my-6 mx-14"/>
  <section class="gap-20 inner-wrapper" data-id="section2" :class="['fade-in', { 'visible': sectionVisibility['section2'] }]">
    <div class="main-intro">
      <v-icon size="x-large">mdi-hand-heart</v-icon>
      <p class="h2 text-center">{{ $t('page.home.section3.title')}}</p>
      <p class="h5 text-center">{{ $t('page.home.section3.content')}}</p>
    </div>
    <v-img src="/img/contribute.png" class="banner-img shadow-img" width="330" height="330"/>
  </section>
<page-switcher :right-path="{title: 'Dashboard', to: '/class/classInfo'}"/>
</template>

<style scoped>
.inner-wrapper{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 1.5rem;
}
.inner-wrapper-reverse{
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
  align-items: center;
  margin-top: 3.5rem;
}
.main-intro{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
  margin-right: 20px;
}
.banner-img{
  width: 50%;
  height: 100%;
  border-radius: 10px;
}
.start-btn{
  position: fixed;
  bottom: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 3rem;
}


@media (max-width: 768px) {
  .inner-wrapper{
    flex-direction: column-reverse;
  }
  .inner-wrapper-reverse{
    flex-direction: column-reverse;
  }
  .gap-20{
    gap: 30px;
  }
  .main-intro{
    width: 100%;
    margin-right: 0;
  }
  .banner-img{
    width: 75%;
    height: 50%;
  }
}
@media (max-width: 425px) {
  .banner-img{
    width: 100%;
    height: 50%;
  }
  .h1{
    font-size: 1.5rem;
  }
  .h5{
    font-size: .99rem;
  }
}





</style>