<script setup>
import {onMounted, watch} from "vue";
import { codeToHtml } from 'shikiji'
import {useTheme} from "vuetify";

const theme = useTheme();
const htmlResult = ref('');
const themeName = ref(theme.global.name.value)
const props = defineProps([ 'code', 'lang']);

onMounted(() => {
    const codeBlockTheme = themeName.value === 'dark' ? 'ayu-dark' : 'catppuccin-latte'
    codeToHtml(props.code, {
        lang: props.lang,
        theme: codeBlockTheme,
    }).then((html) => {
        htmlResult.value = html;
    }).then(() => {
        let codeBlock = document.getElementsByTagName('pre')
        for(let i = 0; i < codeBlock.length; i++){
            codeBlock[i].style.overflow = 'scroll'
            codeBlock[i].style.padding = '1.14rem'
        }
    })
})

watch(theme.global.name, (newTheme) => {
    themeName.value = newTheme;
    const codeBlockTheme = themeName.value === 'dark' ? 'ayu-dark' : 'catppuccin-latte'
    codeToHtml(props.code, {
        lang: 'javascript',
        theme: codeBlockTheme
    }).then((html) => {
        htmlResult.value = html;
    }).then(() => {
        document.getElementsByTagName('pre')[0].style.overflow = 'scroll'

    })
})
</script>

<template>
    <div class="relative-container">
        <v-btn prepend-icon="mdi-content-copy" size="x-small" :rounded="false" class="btn-pos">copy</v-btn>
        <div v-html="htmlResult" class="code-area"></div>
    </div>
</template>

<style scoped>
.relative-container {
  position: relative;
  overflow: auto; /* 스크롤이 필요할 때만 나타나도록 변경 */
  width: 100%;
  //box-shadow: 0px 0px 20px 0px rgba(128, 128, 128, 0.07);
  font-family: monospace, monospace !important;
}

.btn-pos {
    position: absolute;
    top: 0.4rem;
    right: 0.5rem;
    z-index: 10; /* 다른 요소들 위에 버튼이 나타나도록 z-index 설정 */
}

.code-area {
    width: 100% !important; /* pre 요소가 div의 전체 너비를 차지하도록 설정 */
    margin: 0; /* 필요한 경우 margin 제거 */
    overflow: scroll;

}
code {
    padding: 1rem !important;
}
</style>