import Swapper from '../core/Swapper';
import Node from '../engine/Node';

// CSS Classes
const CSS_CLASS_HEADER = 'hybrid-header';

/**
 * Header Component
 *
 * @class Header
 * @return {Header} A new instance of Header
 */
class Header extends Node {

  /**
   * @constructor
   *
   */
  constructor (properties) {
    super(properties);

    this.setClasses([CSS_CLASS_HEADER]);

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

    let left = new DOMElement(this.left, {
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

    let center = new DOMElement(this.center, {
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

    let right = new DOMElement(this.right, {
      classes: ['right']
    });
  }
}

export Header;
