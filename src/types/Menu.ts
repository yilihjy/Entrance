
/**
 * Menu组件的data()
 */
export interface Menu {
  /**
   * 子菜单左侧剩余空间（单位px）
   */
  subMenuLeftRemainSpace: number;
  /**
   * 子菜单右侧剩余空间（单位px）
   */
  subMenuRightRemainSpace: number;
  /**
   * 子菜单展开方向
   */
  subMenuOrientation: string;
  /**
   * 子菜单下方剩余空间（单位px）
   */
  subMenuBottomRemainSpace: number;

}

/**
 * 键盘按键和执行函数的映射
 */
export interface KeyboardActionMap {
  /**
   * 键盘keycode组成的数组，请与actions保持对应
   */
  keys: Array<number>;
  /**
   * 执行函数组成的数组，请与keys保持对应
   */
  actions: Array<Function>;
}

/**
 * Menu组件的prop
 */
export  interface MenuProp {
  /**
   *
   */
  isRootMenu: boolean;
  rootMenuParentElement: HTMLElement;
  clientX: number;
  clientY: number;
  menuGroups: Array<Array<MenuItem>>;
}

export interface SubMenuProp {
  menuGroups: Array<Array<MenuItem>>;
}
export interface MenuItem {
  mainText: string;
  subText?: string;
  icon?: string;
  action?: Function;
  subMenuGroups?: SubMenuProp;
  keycode?: number;
  disabled?: boolean;
  active?: boolean;
  activeTimeOut?: number;
}
