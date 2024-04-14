<script setup lang="ts">
const localePath = useLocalePath()
const props = defineProps({
  leftPath: {
    type: Object,
    default: {}
  },
  rightPath: {
    type: Object,
    default: {}
  }
})
</script>

<template>
  <div class="btn-wrapper">
    <div class="btn-inner">
      <v-btn width="122" variant="plain" :to="localePath(leftPath.to)" :ripple="false" :disabled="!leftPath">
        <v-icon v-if="leftPath.title">mdi-arrow-left-thin</v-icon>
        {{ leftPath.title ? $t(`menu.${leftPath.title}`) : '' }}</v-btn>
      <v-btn width="122" variant="plain" :to="localePath(rightPath.to)" :ripple="false" :disabled="!rightPath">
        {{ rightPath ? $t(`menu.${rightPath.title}`) : ''}}
        <v-icon v-if="rightPath.title">mdi-arrow-right-thin</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
.btn-wrapper{
  margin-top: 3rem;
  display: flex;
  justify-content: center;
}
.btn-inner{
  display: flex;
  justify-content: space-between;
  width: 50%;
}
</style>