/**
 * 点击菜单信息
 */
export interface MenuClickInformation {
  /**
   * 是否显示菜单
   */
  showMenu:Boolean;
  /**
   * 父元素宽度
   */
  parentWidth:number;
  /**
   * 父元素高度
   */
  parentHeight:number;
  /**
   * 事件触发点的水平坐标
   */
  clinetX:number;
  /**
   * 事件触发点的垂直坐标
   */
  clientY:number;
}