var Node = HybridUI.engine.Node;

const CSS_CLASS_LIST_ITEM = 'hybrid-list-item';

/**
 * ListItem Component
 *
 * @class Header
 * @return {ListItem} A new instance of ListItem
 */
class ListItem extends Node {

  /**
   * @constructor
   *
   */
  constructor (properties) {

    this.setClasses([CSS_CLASS_LIST_ITEM]);

  }
}

HybridUI.components.ListItem = ListItem;