import Node from '../engine/Node';

// CSS Classes
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
    super(properties);

    this.setClasses([CSS_CLASS_MENU]);

  }
}

HybridUI.components.Menu = Menu;
