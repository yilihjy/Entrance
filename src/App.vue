<template>
  <entrance-desktop :backgrounds="backgrounds" backgroundMode="aspectFill" />
</template>

<style lang="scss">
@import url("./scss/global.scss");
</style>

<script lang="ts">
import { defineComponent } from "vue";
import EntranceDesktop from "@/components/Desktop.vue"; // @ is an alias to /src

export default defineComponent({
  name: "Home",
  components: {
    EntranceDesktop
  },
  data() {
    return {
      backgrounds: [
        "/img/background/background-00.jpg",
        "/img/background/background-01.jpg",
        "/img/background/background-02.jpg"
      ]
    };
  }
});
</script>
