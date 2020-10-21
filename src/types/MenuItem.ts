/**
 * 菜单项
 */
export interface MenuItem {
  mainText: string;
  subText?: string;
  icon?: string;
  action?: MenuItemAction;
  subMenuItems?: Array<MenuItem>;
}

interface MenuItemAction {
  (...args: any[]): void;
}
