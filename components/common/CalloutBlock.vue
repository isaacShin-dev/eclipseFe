<script setup>
const props = defineProps(['width', 'icon', 'content'])

</script>

<template>
    <v-sheet
            width="100%"
            class="bg-blue-grey-lighten-4 left-border mt-6">
        <v-row justify="space-around">
            <v-col class="flex-grow-0 pr-0">
                <v-icon size="small" color="blue-grey-lighten-1">{{ icon }}</v-icon>
            </v-col>
            <v-col cols="11" class="pl-0">
                <p class="">{{ content }}</p>
            </v-col>
        </v-row>
    </v-sheet>

</template>

<style scoped>
.left-border{
    border-left: 5px solid rgb(157, 178, 191);
}

</style>