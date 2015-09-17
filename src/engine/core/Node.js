import Curve from '../Curve';
import Utility from '../Utility';

/**
 * Node Class
 *
 * @class Node
 * @return {Node} A new instance of Node
 */
export default
class Node extends THREE.Object3D {

  /**
   * @constructor
   *
   * @param {Object} properties Properties object -- see example
   *
   * @example
   * let node = new Node({
   *   classes: ['open'],
   *   position: [200, 300, 0],
   *   rotation: [3, 0, 0],
   *   scale: [1, 1, 1],
   *   size: {
   *     modes: ['absolute', 'relative'],
   *     absolute: [300, null],
   *     proportional: [null, .5]
   *   },
   *   opacity: .9
   * })
   */
  constructor (properties) {
    super();

    this._mounted = false;

    // Properties Cache
    this._properties = {
      opacity: null,
      origin: [],
      mountPoint: [],
      align: [],
      size: {
        modes: [],
        absolute: [],
        proportional: []
      }
    }

    // Tweens
    this._tweens = {
      opacity: null,
      position: null,
      rotation: null,
      scale: null
    };

    Object.defineProperties(this, {
      opacity: {
        set: function (value) {
          this._properties.opacity = value;
           this._applyStyle('opacity', value);
        }.bind(this),
        get: function () {
          return this._properties.opacity;
        }.bind(this)
      }
    });

    this.addEventListener('removed', function (event) {
      if (this.element.parentNode !== null) {
        this.element.parentNode.removeChild(this.element);
      }
    });

    this.setProperties(_.extend({
      opacity: 1,
      origin: [0.5, 0.5],
      mountPoint: [0.5, 0.5],
      align: [.5, .5, 0],
      size: {
        modes: ['absolute', 'absolute'],
        absolute: [100, 200],
        proportional: [1, 1]
      }
    }, properties || {}));
  }

  /**
   * [setPosition description]
   *
   * @method
   * @memberOf Node
   * @param {Array} position [description]
   * @param {Object} transition [description]
   */
  setPosition (position, transition) {
    if (! transition)
      this.position.set(position[0], position[1], position[2] || 0);
    else {
      if (! this._tweens.position)
        this._tweens.position = new TWEEN.Tween(this.position);
      this._tweens.position.stop()
        .to({ x: position[0], y: position[1], z: position[2] || 0}, transition.duration)
        .easing(new Curve(transition.curve).get())
        .start();
    }
  }

  /**
   * [setRotation description]
   *
   * @method
   * @memberOf Node
   * @param {Array} rotation [description]
   * @param {Object} transition [description]
   */
  setRotation (rotation, transition) {
    if (! transition)
      this.rotation.set(rotation[0], rotation[1], rotation[2]);
    else {
      if (! this._tweens.rotation)
        this._tweens.rotation = new TWEEN.Tween(this.rotation);
      this._tweens.rotation.stop()
        .to({ x: rotation[0], y: rotation[1], z: rotation[2] }, transition.duration)
        .easing(new Curve(transition.curve).get())
        .start();
    }
  }

  /**
   * [setScale description]
   *
   * @method
   * @memberOf Node
   * @param {Array} scale [description]
   * @param {Object} transition [description]
   */
  setScale (scale, transition) {
    if (! transition)
      this.scale.set(scale[0], scale[1], scale[2]);
    else {
      if (! this._tweens.scale)
        this._tweens.scale = new TWEEN.Tween(this.scale);
      this._tweens.scale.stop()
        .to({ x: scale[0], y: scale[1], z: scale[2] }, transition.duration)
        .easing(new Curve(transition.curve).get())
        .start();
    }
  }

  /**
   * [setOpacity description]
   *
   * @method
   * @memberOf Node
   * @param {Number} opacity [description]
   * @param {Object} transition [description]
   */
  setOpacity (opacity, transition) {
    if (! transition)
      this.opacity = opacity;
    else {
      if (! this._tweens.opacity)
        this._tweens.opacity = new TWEEN.Tween(this);
      this._tweens.opacity.stop()
        .to( {opacity: opacity}, transition.duration)
        .easing(new Curve(transition.curve).get())
        .start();
    }
  }

  /**
   * [setSizeModes description]
   *
   * @method
   * @memberOf Node
   * @param {Array} modes [description]
   */
  setSizeModes (modes) {
    if (! _.isEqual(modes, this._properties.size.modes)) {
      this._properties.size.modes = modes;
      this._applySize();
    }
  }

  /**
   * [setAbsolute description]
   *
   * @method
   * @memberOf Node
   * @param {Array} size [description]
   * @param {Object} transition [description]
   */
  setAbsoluteSize (size, transition) {
    if (! transition) {
      if (! _.isEqual(size, this._properties.size.absolute)) {
        this._properties.size.absolute = size;

        if (this._properties.size.modes.indexOf('absolute') > -1)
          this._applySize();
      }
    } else {
      // Handle transition
    }
  }

  /**
   * [setProportionalSize description]
   *
   * @method
   * @memberOf Node
   * @param {Array} size [description]
   * @param {Object} transition [description]
   */
  setProportionalSize (size, transition) {
    if (! transition) {
      if (! _.isEqual(size, this._properties.size.proportional)) {
        this._properties.size.proportional = size;

        if (this._properties.size.modes.indexOf('relative') > -1)
          this._applySize();
      }
    } else {
      // Handle transition
    }
  }

  /**
   * [setAlign description]
   *
   * @method
   * @memberOf Node
   * @param {Array} alignment [description]
   * @param {Object} transition [description]
   */
  setAlign (alignment, transition) {
    if (! transition) {
      if (! _.isEqual(alignment, this._properties.align)) {
        this._properties.align = alignment;
        this._applyTransform();
      }
    } else {
      // Handle transition
    }
  }

  /**
   * Set all properties of the Node in one method with optional transition
   *
   * @todo Maybe make the second parameter a Transition class
   *
   * @method
   * @memberOf Node
   * @param {Object} properties Properties object - see example
   * @param {String} transition Transition
   *
   * @example
   * node.setProperties({
   *   position: [200, 300, 0],
   *   rotation: [3, 0, 0],
   *   scale: [1, 1, 1],
   *   size: {
   *     modes: ['absolute', 'relative'],
   *     absolute: [300, null],
   *     proportional: [null, .5]
   *   },
   *   opacity: .9
   * }, {
   *   duration: 2000,
   *   curve: 'ExponentialIn'
   * })
   */
  setProperties (properties, transition) {

    // Position
    if (properties.position)
      this.setPosition(properties.position, transition);

    // Rotation
    if (properties.rotation && properties.rotation.length === 3)
      this.setRotation(properties.rotation, transition);

    // Scale
    if (properties.scale && properties.scale.length === 3)
      this.setScale(properties.scale, transition);

    // Align
    if (properties.align && properties.align.length === 3)
      this.setAlign(properties.align);

    // Size
    if (properties.size) {

      // Size Modes
      if (properties.size.modes && properties.size.modes.length === 2)
        this.setSizeModes(properties.size.modes);

      // Absolute Size
      if (properties.size.absolute && properties.size.absolute.length === 2)
        this.setAbsoluteSize(properties.size.absolute);

      // Relative Size
      if (properties.size.proportional && properties.size.proportional.length === 2)
        this.setProportionalSize(properties.size.proportional);

    }

    // Opacity
    if (typeof properties.opacity != 'undefined')
      this.setOpacity(properties.opacity, transition);
  }

  /**
   * Method to add child Node
   *
   * @method
   * @memberof Node
   * @param {Node} node [description]
   */
  addChild (node) {
    node.parent
    this.add(node);
  }

  /**
   * Mound the Node in the DOM
   *
   * @method
   * @memberof Node
   */
  _mount (parentElement) {
    parentElement.appendChild(this.element);
    this._mounted = true;
  }


}
