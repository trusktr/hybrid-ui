var Node = HybridUI.engine.Node;

const CSS_CLASS_MENU = 'hybrid-menu';

/**
 * Menu Component
 *
 * @class Menu
 * @return {Menu} A new instance of Menu
 */
class Menu extends Node {

  /**
   * @constructor
   *
   */
  constructor (properties) {

    this.setClasses([CSS_CLASS_MENU]);

  }
}

HybridUI.components.Menu = Menu;