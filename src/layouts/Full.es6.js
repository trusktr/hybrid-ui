var Node = HybridUI.engine.Node;
var Swapper = HybridUI.components.Swapper;

/**
 * Full Class
 *
 * @class Full
 * @return {Full} A new instance of Full
 */
class Full extends Node {

  /**
   * @constructor
   */
  constructor (options) {
    super(options);

    this.setClasses(['layouts-full']);

    this.sections = {
      body: new Swapper({
        classes: ['body']
      })
    };

    this.add(sections.body);

  }
}

HybridUI.layouts.Full = Full;