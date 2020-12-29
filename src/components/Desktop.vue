<template>
  <div
    class="entrance-desktop-container"
    :style="backgroundStyle"
    @contextmenu="clickDesktopByRight($event)"
    @click="clickDesktop($event)"
  >
    <entrance-menu
      :menuOption="menuOption"
      @close="closeDesktopMenu()"
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
  transition: background-image 500ms; // 标准中background-image不支持动画，详见https://www.w3.org/TR/css-backgrounds-3/#background-image，参考解决方案：https://stackoverflow.com/questions/9483364/css3-background-image-transition，https://blog.csdn.net/yhb241/article/details/51489093
}
</style>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import Console from "@/utils/console";
import { ImageMode } from "@/types/ImageMode";
import { CSSBackground } from "@/types/CSS";
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
      menuOption: {
        isRootMenu: true,
        rootMenuParentElement: document.getElementsByTagName("body")[0],
        clientX: 0,
        clientY: 0,
        menuGroups: []
      }
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
  methods: {
    /**
     * 关闭桌面菜单
     */
    closeDesktopMenu() {
      this.menuOption = {
        isRootMenu: true,
        rootMenuParentElement: document.getElementsByTagName("body")[0],
        clientX: 0,
        clientY: 0,
        menuGroups: []
      };
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
      Console.log(event);
      event.preventDefault();
      const target = event.target as HTMLElement;
      const nextBackground = () => {
        this.closeDesktopMenu();
        this.showNextDesktopbackground();
      };
      const reload = () => {
        location.reload();
      };
      this.menuOption = {
        isRootMenu: true,
        rootMenuParentElement: target,
        clientX: event.clientX,
        clientY: event.clientY,
        menuGroups: [
          [
            {
              mainText: "下一个桌面背景(N)",
              action: nextBackground,
              keycode: 78
            },
            {
              mainText: "刷新(E)",
              action: reload,
              keycode: 69
            }
          ]
        ]
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
    }
  }
});
</script>
