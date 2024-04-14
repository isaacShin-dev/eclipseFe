<script setup lang="ts">
import {useTheme} from "vuetify";
const { locale } = useI18n();
const props = defineProps({
  titles: {
  type: Array,
  required: true,
  },
  pageName:{
    type: String,
    required: true,
  }
});

const current = ref('');
const theme = useTheme();

const titleAnchor = (title: string, pageName: string) => {
  return `/${locale.value}/${pageName}/#`+title;
};
const scrollTo = (title: string) => {
  const element = document.getElementById(title);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const handleScroll = () => {
  let found = false; // 활성화된 요소를 찾았는지 여부
  for (const title of props.titles) {
    const element = document.getElementById(title);
    if (element) {
      const rect = element.getBoundingClientRect(); // 요소의 크기와 위치를 반환
      const activationPoint = 150; // 화면 상단에서부터의 오프셋
      const isReached = rect.top <= activationPoint && rect.bottom >= activationPoint;
      if (isReached && !found) {
        current.value = title;
        found = true; // 첫 번째로 조건을 만족하는 요소를 찾으면 반복 중단
      }
    }
  }
  if (!found) {
    current.value = ''; // 스크롤이 충분히 내려가 어떤 요소도 활성화되지 않은 경우
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
    <v-navigation-drawer location="right" :color="theme.global.name.value === 'dark' ? '#3A3A39' : '#FFFEFC'"
                         mobile-breakpoint="lg"
                         :width="255"
                         floating
    >
                <span class="text-overline">
                        <v-icon>mdi-format-list-bulleted</v-icon>
                    TABLE OF CONTENTS
                </span>
        <v-list :lines="false"
                density="compact">

            <p class="text-caption pl-7 py-1 my-2 pointer" :class="{'bordered-left': current === title}"
               v-for="title in titles" :key="title"
                @click="scrollTo(title)">
            {{ title }}
            </p>

        </v-list>
    </v-navigation-drawer>
</template>

<style scoped>
a{
  display: block;
  text-decoration: none;
  color: inherit;
}
.bordered-left{
  border-left: 2.5px solid #2F456B;
}
.pointer{
    cursor: pointer;
}
.pointer:hover{
  color: #979595;
  border-bottom: rgba(181, 181, 181, 0.2) 1px solid;
}
</style>