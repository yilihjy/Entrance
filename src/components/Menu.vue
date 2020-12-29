<template>
  <div
    ref="menu"
    class="entrance-desktop-menu"
    :style="
      menuOption.menuGroups.length > 0
        ? menuOption.isRootMenu
          ? rootMenuStyle()
          : subMenuStyle()
        : { display: 'none' }
    "
    @click="clickDeskMenu($event)"
    @contextmenu="
      $event => {
        $event.preventDefault();
        $event.stopPropagation();
      }
    "
  >
    <div
      class="menu-group"
      v-for="(menuGroup, index) in menuOption.menuGroups"
      :key="index"
    >
      <div
        class="menu-item"
        :class="{ disabled: item.disabled }"
        v-for="item in menuGroup"
        :key="item.mainText"
        @click="clickItem(item)"
        @mouseenter="mouseenter($event, item)"
        @mouseleave="mouseleave($event, item)"
      >
        <span class="icon"></span>
        <span class="menu-text left-text">{{ item.mainText }}</span>
        <span class="menu-text right-text">{{ item.subText }}</span>
        <span class="arrow" v-show="item.subMenuGroups"></span>
        <entrance-menu
          v-if="item.subMenuGroups && item.active"
          :menuOption="item.subMenuGroups"
          :leftRemainSpace="subMenuLeftRemainSpace"
          :rightRemainSpace="subMenuRightRemainSpace"
          :orientation="subMenuOrientation"
          :bottomRemainSpace="subMenuBottomRemainSpace"
        ></entrance-menu>
      </div>
      <div class="menu-border"></div>
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

  .menu-group {
    .menu-border {
      width: 196px;
      margin: 0 10px;
      border-bottom: rgb(145, 145, 145) solid 1px;
    }
    &:last-child > .menu-border {
      display: none;
    }
    .menu-item {
      width: 198px;
      height: 24px;
      padding: 0px 9px;
      position: relative;
      top: 0;
      left: 0;
      cursor: pointer;
      * {
        display: inline-block;
        vertical-align: middle;
      }
      &:hover {
        background-color: rgb(255, 255, 255);
      }

      &:hover.disabled {
        background-color: inherit;
      }
      &.disabled {
        cursor: inherit;
        .menu-text {
          color: rgb(109, 109, 109);
        }
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
}
</style>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import Console from "@/utils/console";
import { CSSDesktopMenu } from "@/types/CSS";
import {
  Menu,
  MenuItem,
  SubMenuProp,
  MenuProp,
  KeyboardActionMap
} from "@/types/Menu";

export default defineComponent({
  name: "entrance-menu",
  props: {
    orientation: {
      type: String,
      default: "right"
    },
    leftRemainSpace: {
      type: Number,
      default: 0
    },
    rightRemainSpace: {
      type: Number,
      default: 0
    },
    bottomRemainSpace: {
      type: Number,
      default: 0
    },
    menuOption: {
      type: Object as PropType<MenuProp> | PropType<SubMenuProp>,
      require: true,
      default: {
        menuGroup: []
      }
    }
  },
  emits: ["close"],
  data() {
    return {
      subMenuLeftRemainSpace: 0,
      subMenuRightRemainSpace: 0,
      subMenuOrientation: "right",
      subMenuBottomRemainSpace: 0
    } as Menu;
  },
  computed: {
    menuGroupCount(): number {
      return this.menuOption.menuGroups.length;
    },
    menuItemCount(): number {
      return this.menuOption.menuGroups.reduce((accumulator, items) => {
        return accumulator + items.length;
      }, 0);
    },
    menuHeight(): number {
      return 2 + (this.menuGroupCount - 1) + this.menuItemCount * 24;
    },
    keyboardActionMap(): KeyboardActionMap {
      Console.log("keyboardActionMap");
      const keys = [];
      const actions = [];
      for (const group of this.menuOption.menuGroups) {
        for (const item of group) {
          if (!item.disabled && item.keycode) {
            keys.push(item.keycode);
            actions.push(item.action as Function);
          }
        }
      }
      return {
        keys,
        actions
      };
    }
  },
  mounted() {
    window.addEventListener("keydown", this.globalKeydown);
  },
  unmounted() {
    window.removeEventListener("keydown", this.globalKeydown);
  },
  methods: {
    clickDeskMenu(event: MouseEvent) {
      event.stopPropagation();
    },
    clickItem(item: MenuItem) {
      if (item.action && !item.disabled && !item.subMenuGroups) {
        item.action();
      }
    },
    mouseenter(event: MouseEvent, item: MenuItem) {
      if (item.subMenuGroups) {
        if (item.activeTimeOut) {
          window.clearTimeout(item.activeTimeOut);
          item.activeTimeOut = 0;
        }
        item.active = true;
      }
    },
    mouseleave(event: MouseEvent, item: MenuItem) {
      if (item.subMenuGroups) {
        item.activeTimeOut = window.setTimeout(() => {
          item.active = false;
        }, 300);
      }
    },
    globalKeydown(event: KeyboardEvent) {
      const index = this.keyboardActionMap.keys.indexOf(event.keyCode);
      if (index >= 0) {
        const action = this.keyboardActionMap.actions[index];
        action();
        close();
      }
    },
    close() {
      this.$emit("close");
    },
    rootMenuStyle(): CSSDesktopMenu {
      let top = 0;
      let left = 0;
      const menuOption = this.menuOption as MenuProp;
      if (menuOption.isRootMenu) {
        const width = menuOption.rootMenuParentElement.offsetWidth;
        const height = menuOption.rootMenuParentElement.offsetHeight;
        const clientX = menuOption.clientX || 0;
        const clientY = menuOption.clientY || 0;
        if (width - clientX >= 220) {
          left = clientX;
          this.subMenuOrientation = "right";
        } else {
          left = clientX - 220;
          this.subMenuOrientation = "left";
        }
        if (height - clientY >= this.menuHeight) {
          top = clientY;
        } else {
          top = clientY - this.menuHeight;
        }
        this.subMenuRightRemainSpace = width - left - 220;
        this.subMenuLeftRemainSpace = left;
        this.subMenuBottomRemainSpace = height - top - this.menuHeight;
      }
      return {
        display: "block",
        top: `${top}px`,
        left: `${left}px`
      };
    },
    subMenuStyle(): CSSDesktopMenu {
      let top = -3;
      if (this.bottomRemainSpace < this.menuHeight) {
        top = 19 - this.menuHeight;
        this.subMenuBottomRemainSpace = this.bottomRemainSpace;
      } else {
        this.subMenuBottomRemainSpace =
          this.bottomRemainSpace - this.menuHeight + 3;
      }
      if (this.orientation === "right") {
        if (this.rightRemainSpace >= 220) {
          this.subMenuLeftRemainSpace = this.leftRemainSpace + 217;
          this.subMenuRightRemainSpace = this.rightRemainSpace - 217;
          this.subMenuOrientation = "right";
          return {
            display: "block",
            top: `${top}px`,
            left: "217px"
          };
        } else {
          this.subMenuLeftRemainSpace = this.leftRemainSpace - 221;
          this.subMenuRightRemainSpace = this.rightRemainSpace + 221;
          this.subMenuOrientation = "left";
          return {
            display: "block",
            top: `${top}px`,
            left: "-221px"
          };
        }
      } else {
        if (this.leftRemainSpace >= 220) {
          this.subMenuLeftRemainSpace = this.leftRemainSpace - 221;
          this.subMenuRightRemainSpace = this.rightRemainSpace + 221;
          this.subMenuOrientation = "left";
          return {
            display: "block",
            top: `${top}px`,
            left: "-221px"
          };
        } else {
          this.subMenuLeftRemainSpace = this.leftRemainSpace + 217;
          this.subMenuRightRemainSpace = this.rightRemainSpace - 217;
          this.subMenuOrientation = "right";
          return {
            display: "block",
            top: `${top}px`,
            left: "217px"
          };
        }
      }
    }
  }
});
</script>
