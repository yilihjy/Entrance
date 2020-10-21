import { MenuClickInformation } from "./MenuClickInformation";
import { MenuItem } from "./MenuItem";

/**
 * Desktop组件的Data()
 */
export interface Desktop {
  /**
   * 当前桌面背景的索引
   */
  backgroundIndex: number;
  /**
   * 加载完成的背景图片
   */
  loadedBackgrounds: Array<string>;
  /**
   * 桌面菜单的位置信息
   */
  menuInformation: MenuClickInformation;
  /**
   * 桌面菜单的项目信息
   */
  menuItems: Array<MenuItem>;
  /**
   * 桌面菜单的快捷键信息
   */
  keyboardActionMap: KeyboardActionMap;
}
/**
 * 键盘按键和执行函数的映射
 */
interface KeyboardActionMap {
  /**
   * 键盘keycode组成的数组，请与actions保持对应
   */
  keys: Array<number>;
  /**
   * 执行函数组成的数组，请与keys保持对应
   */
  actions: Array<Function>;
}
