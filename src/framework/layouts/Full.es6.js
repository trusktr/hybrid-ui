import Node from '../Node';
import Swapper from '../../ui-components/core/Swapper';

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

export Full;
