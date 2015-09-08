var Node = HybridUI.engine.Node;

const CSS_CLASS_TAB_BAR = 'hybrid-tab-bar';

/**
 * TabBar Component
 *
 * @class TabBar
 * @return {TabBar} A new instance of TabBar
 */
class TabBar extends Node {

  /**
   * @constructor
   */
  constructor (tabs) {
    super();

    this.setClasses([CSS_CLASS_TAB_BAR]);

    _.each(tabs, function (tab, i) {
      this.addChild(tab)
        .setProportionalSize(1 / tabs.length, 1)
        .setAlign(i / tabs.length);
    }.bind(this));
  }
}

HybridUI.components.TabBar = TabBar;