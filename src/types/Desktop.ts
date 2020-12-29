import {MenuProp} from "./Menu";

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

  menuOption: MenuProp;
}

