var Node = HybridUI.engine.Node;
var Swapper = HybridUI.components.Swapper;

const CSS_CLASS_FOOTER = 'hybrid-footer';

/**
 * Footer Component
 *
 * @class Footer
 * @return {Footer} A new instance of Footer
 */
class Footer extends Node {

  /**
   * @constructor
   *
   */
  constructor (properties) {
    super(this);

    this.setClasses([CSS_CLASS_FOOTER]);

    this.createLeft();
    this.createCenter();
    this.createRight();
  }

  /**
   * [createLeft description]
   * @return {[type]} [description]
   */
  createLeft () {
    this.left = this.addChild()
      .setSizeMode('relative', 'relative')
      .setProportionalSize(.25, 1)
      .addChild(new Swapper());

    var left = new DOMElement(this.left, {
      classes: ['left']
    });
  }

  /**
   * [createCenter description]
   * @return {[type]} [description]
   */
  createCenter () {
    this.center = this.addChild()
      .setSizeMode('relative', 'relative')
      .setProportionalSize(.5, 1)
      .setAlign(.25, 0)
      .addChild(new Swapper());

    var center = new DOMElement(this.center, {
      classes: ['center']
    });
  }

  /**
   * [createRight description]
   * @return {[type]} [description]
   */
  createRight () {
    this.right = this.addChild()
      .setSizeMode('relative', 'relative')
      .setProportionalSize(.25, 1)
      .setAlign(.75, 0)
      .addChild(new Swapper());

    var right = new DOMElement(this.right, {
      classes: ['right']
    });
  }
}

HybridUI.components.Footer = Footer;