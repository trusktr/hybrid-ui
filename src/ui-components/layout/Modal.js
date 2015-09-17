import Node from '../engine/Node';

// CSS Classes
const CSS_CLASS_MODAL = 'hybrid-modal';

/**
 * Modal Component
 *
 * @class Modal
 * @return {Modal} A new instance of Modal
 */
class Modal extends Node {

  /**
   * @constructor
   *
   */
  constructor (properties) {
    super(properties);

    this.setClasses([CSS_CLASS_MODAL]);

  }
}

export Modal;
