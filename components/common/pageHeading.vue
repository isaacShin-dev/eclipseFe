<script setup>
const linkCopied = ref(false);
const props = defineProps(['title', 'subtitle']);
const copyLink = async () => {
    try {
        // 현재 URL 가져오기
        const currentUrl = window.location.href;
        // 클립보드에 복사
        await navigator.clipboard.writeText(currentUrl);
        // 알림 상태 설정
        linkCopied.value = true;
    } catch (err) {
        console.error('Clipboard copy failed', err);
    }
};
</script>

<template>
    <p class="text-overline ms-1">{{ subtitle }}</p>
    <v-row align="center">
        <v-col cols="auto"><h1 class="text-h4 text-xl-h1">{{ title }}</h1></v-col>
        <v-col cols="auto">
            <v-menu :height="50">
                <template v-slot:activator="{ props }">
                    <v-icon size="large" v-bind="props">mdi-dots-vertical</v-icon>
                </template>
                <v-list density="compact" :lines="false">
                    <v-list-item prepend-icon="mdi-link-variant" @click="copyLink" class="text-caption">
                        <v-list-item-title>Copy link</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-col>
    </v-row>
    <v-divider class="mb-3"></v-divider>
    <v-snackbar
        v-model="linkCopied"
        multi-line
        timeout="3000"
    >
        Link copied to clipboard
    </v-snackbar>
</template>

<style scoped>

</style>