<template>
  <div
    class="entrance-desktop-container"
    :style="backgroundStyle"
    @contextmenu="clickDesktopByRight($event)"
    @click="clickDesktop($event)"
  >
    <entrance-menu
      :menuInformation="menuInformation"
      :menuItems="menuItems"
    ></entrance-menu>
  </div>
</template>

<style lang="scss" scoped>
.entrance-desktop-container {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0px;
  left: 0px;
  transition: background 500ms;
}
</style>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import Console from "@/utils/console";
import { ImageMode } from "@/types/ImageMode";
import { CSSBackground } from "@/types/CSSBackground";
import { Desktop } from "@/types/Desktop";
import EntranceMenu from "@/components/Menu.vue";

export default defineComponent({
  name: "entrance-desktop",
  components: {
    EntranceMenu
  },
  props: {
    backgrounds: {
      type: Array as PropType<Array<string>>,
      default: [],
      required: false
    },
    backgroundMode: {
      type: String as PropType<ImageMode>
    }
  },
  data() {
    return {
      backgroundIndex: 0,
      loadedBackgrounds: [],
      menuInformation: {
        showMenu: false,
        parentWidth: 0,
        parentHeight: 0,
        clinetX: 0,
        clientY: 0
      },
      menuItems: [],
      keyboardActionMap: { keys: [], actions: [] }
    } as Desktop;
  },
  computed: {
    backgroundStyle(): CSSBackground {
      const backgroundObj: CSSBackground = {};
      if (this.loadedBackgrounds.length > 0) {
        backgroundObj.backgroundImage = `url(${
          this.loadedBackgrounds[this.backgroundIndex]
        })`;
      } else {
        backgroundObj.backgroundColor = "rgb(0,120,215)";
      }
      switch (this.backgroundMode) {
        case "scaleToFill": // 缩放模式，不保持纵横比缩放图片，使图片的宽高完全拉伸至填满 image 元素
          backgroundObj.backgroundSize = "100% 100%";
          backgroundObj.backgroundRepeat = "no-repeat";
          break;
        case "aspectFit": // 缩放模式，保持纵横比缩放图片，使图片的长边能完全显示出来。也就是说，可以完整地将图片显示出来。
          backgroundObj.backgroundSize = "contain";
          backgroundObj.backgroundRepeat = "no-repeat";
          backgroundObj.backgroundPosition = "center";
          break;
        case "aspectFill": // 缩放模式，保持纵横比缩放图片，只保证图片的短边能完全显示出来。也就是说，图片通常只在水平或垂直方向是完整的，另一个方向将会发生截取。
          backgroundObj.backgroundSize = "cover";
          backgroundObj.backgroundRepeat = "no-repeat";
          backgroundObj.backgroundPosition = "center";
          break;
        case "widthFix": // 缩放模式，宽度不变，高度自动变化，保持原图宽高比不变
          backgroundObj.backgroundSize = "100% auto";
          backgroundObj.backgroundRepeat = "no-repeat";
          break;
        case "heightFix": // 缩放模式，高度不变，宽度自动变化，保持原图宽高比不变
          backgroundObj.backgroundSize = "auto 100%";
          backgroundObj.backgroundRepeat = "no-repeat";
          break;
        case "top": // 裁剪模式，不缩放图片，只显示图片的顶部区域
          backgroundObj.backgroundPosition = "top";
          break;
        case "bottom": // 裁剪模式，不缩放图片，只显示图片的底部区域
          backgroundObj.backgroundPosition = "bottom";
          break;
        case "center": // 裁剪模式，不缩放图片，只显示图片的中间区域
          backgroundObj.backgroundPosition = "center";
          break;
        case "left": // 裁剪模式，不缩放图片，只显示图片的左边区域
          backgroundObj.backgroundPosition = "left";
          break;
        case "right": // 裁剪模式，不缩放图片，只显示图片的右边区域
          backgroundObj.backgroundPosition = "right";
          break;
        case "top left": // 裁剪模式，不缩放图片，只显示图片的左上边区域
          backgroundObj.backgroundPosition = "top left";
          break;
        case "top right": // 裁剪模式，不缩放图片，只显示图片的右上边区域
          backgroundObj.backgroundPosition = "top right";
          break;
        case "bottom left": // 裁剪模式，不缩放图片，只显示图片的左下边区域
          backgroundObj.backgroundPosition = "bottom left";
          break;
        case "bottom right": // 裁剪模式，不缩放图片，只显示图片的右下边区域
          backgroundObj.backgroundPosition = "bottom right";
          break;
        default:
          break;
      }
      return backgroundObj;
    }
  },
  created() {
    this.loadBackgroundimages(this.backgrounds);
  },
  mounted() {
    window.addEventListener("keydown", this.globalKeydown);
  },
  unmounted() {
    window.removeEventListener("keydown", this.globalKeydown);
  },
  methods: {
    /**
     * 关闭桌面菜单
     */
    closeDesktopMenu() {
      this.menuInformation = {
        showMenu: false,
        parentWidth: 0,
        parentHeight: 0,
        clinetX: 0,
        clientY: 0
      };
      this.menuItems = [];
      this.keyboardActionMap = { keys: [], actions: [] };
    },
    /**
     * 点击桌面空白处
     */
    clickDesktop() {
      this.closeDesktopMenu();
    },
    /**
     * 鼠标右键点击桌面或者键盘菜单键
     */
    clickDesktopByRight(event: MouseEvent) {
      event.preventDefault();
      const target = event.target as HTMLElement;
      const nextBackground = () => {
        this.closeDesktopMenu();
        this.showNextDesktopbackground();
      };
      const reload = () => {
        location.reload();
      };
      /**
       * 设置菜单内容
       */
      this.menuItems = [
        {
          mainText: "下一个桌面背景(N)",
          action: nextBackground
        },
        {
          mainText: "刷新(E)",
          action: reload
        }
      ];
      /**
       * 设置键盘映射
       */
      this.keyboardActionMap = {
        keys: [78, 69],
        actions: [nextBackground, reload]
      };
      /**
       * 设置菜单位置
       */
      this.menuInformation = {
        showMenu: true,
        parentWidth: target.offsetWidth,
        parentHeight: target.offsetHeight,
        clinetX: event.clientX,
        clientY: event.clientY
      };
    },
    /**
     * 显示下一个桌面背景
     */
    showNextDesktopbackground() {
      if (this.backgroundIndex < this.loadedBackgrounds.length - 1) {
        this.backgroundIndex++;
      } else {
        this.backgroundIndex = 0;
      }
    },
    /**
     * 加载背景图片
     */
    loadBackgroundimages(queue: Array<string>) {
      const loadQueue = queue.slice(0, queue.length);
      const preLoadURL = loadQueue.shift();
      if (preLoadURL) {
        let imgElement: HTMLImageElement | null = document.createElement("img");
        imgElement.onload = () => {
          Console.log(`${preLoadURL} has onload`);
          this.loadedBackgrounds.push(preLoadURL);
          imgElement = null;
          this.loadBackgroundimages(loadQueue);
        };
        imgElement.onerror = () => {
          Console.log(`${preLoadURL} has onerror`);
          imgElement = null;
          this.loadBackgroundimages(loadQueue);
        };
        imgElement.src = preLoadURL;
      }
    },
    /**
     * 全局键盘监听，处理菜单选项对应的快捷键
     */
    globalKeydown(event: KeyboardEvent) {
      const index = this.keyboardActionMap.keys.indexOf(event.keyCode);
      if (index >= 0) {
        const action = this.keyboardActionMap.actions[index];
        action();
        this.closeDesktopMenu();
      }
    }
  }
});
</script>
