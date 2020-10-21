<template>
  <div
    class="entrance-desktop-menu"
    :style="desktopMenuStyle"
    @click="clickDeskMenu($event)"
    @contextmenu="
      $event => {
        $event.preventDefault();
        $event.stopPropagation();
      }
    "
  >
    <div
      class="menu-item"
      v-for="item in menuItems"
      :key="item.mainText"
      @click="item.action()"
    >
      <span class="icon"></span>
      <span class="menu-text left-text">{{ item.mainText }}</span>
      <span class="menu-text right-text"></span>
      <span class="arrow" v-show="item.subMenuItems"></span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.entrance-desktop-menu {
  width: 216px;
  padding: 1px;
  background-color: rgb(238, 238, 238);
  position: absolute;
  border: 1px solid rgb(160, 160, 160);

  .menu-item {
    width: 198px;
    height: 24px;
    padding: 0px 9px;
    cursor: pointer;
    * {
      display: inline-block;
      vertical-align: middle;
    }
    &:hover {
      background-color: rgb(255, 255, 255);
    }

    .icon,
    .arrow {
      width: 16px;
      height: 16px;
      margin: 4px 0;
    }

    .menu-text {
      height: 16px;
      margin: 4px 0;
      font-size: 12px;
      color: black;
      line-height: 16px;
      white-space: nowrap;
      user-select: none;
    }
    .left-text {
      width: 100px;
      text-align: left;
    }
    .right-text {
      width: 66px;
      text-align: right;
    }

    .arrow {
      background-image: url("../assets/icons/forward-16x16.png");
    }
  }
}
</style>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { CSSDesktopMenu } from "@/types/CSSDesktopMenu";
import { MenuClickInformation } from "@/types/MenuClickInformation";
import { MenuItem } from "@/types/MenuItem";

export default defineComponent({
  name: "entrance-menu",
  props: {
    menuInformation: {
      type: Object as PropType<MenuClickInformation>,
      required: true
    },
    menuItems: {
      type: Array as PropType<Array<MenuItem>>,
      default: []
    }
  },
  computed: {
    desktopMenuStyle(): CSSDesktopMenu {
      let top: number;
      let left: number;
      if (
        this.menuInformation.parentWidth - this.menuInformation.clinetX >
        220
      ) {
        left = this.menuInformation.clinetX;
      } else {
        left = this.menuInformation.clinetX - 220;
      }
      if (
        this.menuInformation.parentHeight - this.menuInformation.clientY >
        24 * this.menuItems.length + 2
      ) {
        top = this.menuInformation.clientY;
      } else {
        top = this.menuInformation.clientY - (24 * this.menuItems.length + 2);
      }
      return {
        display: this.menuInformation.showMenu ? "block" : "none",
        top: `${top}px`,
        left: `${left}px`
      };
    }
  },
  methods: {
    clickDeskMenu(event: MouseEvent) {
      event.stopPropagation();
    }
  }
});
</script>
