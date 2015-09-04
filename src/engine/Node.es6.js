var Curve = HybridUI.engine.Curve;

const CSS_CLASS_NODE = 'hybrid-dom-node';

/**
 * Node Class
 *
 * @todo Add size and align properties/methods similar to famous
 *
 * @class Node
 * @return {Node} A new instance of Node
 */
class Node extends THREE.Object3D {

  /**
   * @constructor
   */
  constructor (properties) {
    //THREE.Object3D.call(this);
    super();

    // DOM representation of Node
    this.element = document.createElement('div');

    // Class Cache
    this._classes = [
      CSS_CLASS_NODE
    ];

    // Force initial class set;
    this.setClasses();

    // Style Cache
    this._styleCache = {
      opacity: 1
    };

    // Tweens
    this._tweens = {
      opacity: null,
      position: null,
      rotation: null,
      scale: null
    };

    // TODO DOM writes need to be sync'd to preven layout thrashing
    Object.defineProperties(this, {
      opacity: {
        set: function (value) {
          this._styleCache._opacity = value;
          this.element.style.opacity = value;
        }.bind(this),
        get: function () {
          return this._styleCache._opacity;
        }.bind(this)
      }
    });

    this.addEventListener('removed', function (event) {
      if (this.element.parentNode !== null) {
        this.element.parentNode.removeChild(this.element);
      }
    });

    this.setProperties(properties);
  }

  /**
   * [setProperties description]
   *
   * @method
   * @memberOf Node
   * @param {[type]} properties [description]
   * @param {[type]} transition [description]
   */
  setProperties (properties, transition) {
    if (properties.classes)
      this.setClasses(properties.classes);

    if (properties.position && properties.position.length === 3)
      this.setPosition(properties.position, transition);

    if (properties.rotation && properties.rotation.length === 3)
      this.setRotation(properties.rotation, transition);

    if (properties.scale && properties.scale.length === 3)
      this.setScale(properties.scale, transition);

    if (typeof properties.opacity != 'undefined')
      this.setOpacity(properties.opacity, transition);
  }

  /**
   * [setPosition description]
   *
   * @method
   * @memberOf Node
   * @param {[type]} classses [description]
   */
  setPosition (position, transition) {
    if (! transition)
      this.position.set(position[0], position[1], position[2]);
    else {
      if (! this._tweens.position)
        this._tweens.position = new TWEEN.Tween(this.position);
      this._tweens.position.stop()
        .to({ x: position[0], y: position[1], z: position[2] }, transition.duration)
        .easing(new Curve(transition.curve).get())
        .start();
    }
  }

  /**
   * [setRotation description]
   *
   * @method
   * @memberOf Node
   * @param {[type]} classses [description]
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
   * @param {[type]} classses [description]
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
   * @param {[type]} classses [description]
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
   * [setClasses description]
   *
   * @todo check to see if updating classes name causes layout thrashing
   *
   * @method
   * @memberOf Node
   * @param {[type]} classses [description]
   */
  setClasses (classes = []) {
    var changed = false;

    for (var c of classes) {

      // If the class isn't already in the class cache add it
      if (this._classes.indexOf(c) == -1) {
        this._classes.push(c);
        changed = true;
      }

    }

    // If the classes have changed update element
    if (changed)
      this.element.className = this._classes.join(" ");
  }
}

HybridUI.engine.Node = Node;
