import NodeComponent from '../core/NodeComponent';
import

// CSS Class
const CSS_CLASS_NODE = 'hybrid-dom-node';

/**
 * DOMElement
 *
 *
 * @class DOMElement
 * @extends NodeComponent
 */
export default
class DOMElement extends NodeComponent {

  /**
   * @constructor
   */
  constructor () {
    super();

    // DOM Element
    this.element = document.createElement('div');

    // Cache CSS Classes
    this._classes = [
      CSS_CLASS_NODE
    ];

    // Cache DOM Style to prevent reads
    this._style = {
      transform:{
        matrix3d: []
      }
    };

    // Force initial class set;
    this.setClasses();
  }


  /**
   * [applySize description]
   *
   * @method
   * @private
   * @memberOf Node
   */
  _applySize () {
    let modes = this._properties.size.modes;
    let absolute = this._properties.size.absolute;
    let proportional = this._properties.size.proportional;

    if (modes[0] === 'absolute')
      this._applyStyle('width', `${absolute[0]}px`);
    else if (modes[0] === 'relative')
      this._applyStyle('width', `${proportional[0] * 100}%`);

    if (modes[1] === 'absolute')
      this._applyStyle('height', `${absolute[1]}px`);
    else if (modes[1] === 'relative')
      this._applyStyle('height', `${proportional[1] * 100}%`);
  }

  /**
   * [applyTransform description]
   *
   * @method
   * @private
   * @memberOf Node
   */
  _applyTransform (){
    let matrix3d = this._style.transform.matrix3d;

    let transform = `
      translate3d(0%, 100%, 0)

      matrix3d(
        ${ Utility.epsilon(  matrix3d[0]  ) },
        ${ Utility.epsilon(  matrix3d[1]  ) },
        ${ Utility.epsilon(  matrix3d[2]  ) },
        ${ Utility.epsilon(  matrix3d[3]  ) },
        ${ Utility.epsilon(- matrix3d[4]  ) },
        ${ Utility.epsilon(- matrix3d[5]  ) },
        ${ Utility.epsilon(- matrix3d[6]  ) },
        ${ Utility.epsilon(- matrix3d[7]  ) },
        ${ Utility.epsilon(  matrix3d[8]  ) },
        ${ Utility.epsilon(  matrix3d[9]  ) },
        ${ Utility.epsilon(  matrix3d[10] ) },
        ${ Utility.epsilon(  matrix3d[11] ) },
        ${ Utility.epsilon(  matrix3d[12] ) },
        ${ Utility.epsilon(  matrix3d[13] ) },
        ${ Utility.epsilon(  matrix3d[14] ) },
        ${ Utility.epsilon(  matrix3d[15] ) }
      )
    `;

    this._applyStyle('transform', transform);
    this._applyStyle('transformOrigin', 'right top 0px');
  }

  /**
   * [setMatrix3d description]
   *
   * @method
   * @private
   * @memberOf Node
   * @param {Array} matrix [description]
   */
  _setMatrix3d (matrix){
    if (true || ! _.isEqual(this._style.transform.matrix3d, matrix)) {
      this._style.transform.matrix3d = matrix;
      this._applyTransform();
    }
  }

  /**
  * Set an attribute on the DOM Element -- this is done after the reads
  * in the raf loop to avoid layout thrashing.
  *
  * @method setAttribute
  * @memberOf DOMElement
  * @param {String} name Name of the attribute
  * @param {String} value Value to apply to the attribute
  */
  setAttribute (name, value){

  }

  /**
  * Read the attribute from the DOM Element -- generally this should be avoided
  * but incase it's needed we should provide a method that does this at the
  * beggining of the raf loop to prevent layout thrashing.
  *
  * @method setAttribute
  * @memberOf DOMElement
  * @param {String} name Name of the attribute
  * @returns {String} Value to apply to the attribute
  */
  getAttribute (name){


    return "value";
  }

  /**
   * Set the DOM Elements class(es) -- This should be done at the after the
   * reads in the raf loop.
   *
   * @method setClasses
   * @memberOf DOMElement
   * @param {Array} classses [description]
   */
  setClasses (classes = []) {
    let changed = false;

    for (let c of classes) {
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
   * }, {
   *   duration: 2000,
   *   curve: 'ExponentialIn'
   * })
   */
  setProperties (properties) {

    // Set Classes
    if (properties.classes)
      this.setClasses(properties.classes);

    super(properties);

  }

  /**
   * [render description]
   *
   * @method
   * @memberOf Node
   * @param  {Scene} scene [description]
   */
  render (scene) {
    this._setMatrix3d(this.matrixWorld.elements);

    if (! this._mounted) {

      // If parent is a Node mount it inside the node
      if (this.parent instanceof Node)
        this._mount(this.parent.element);

      // If this is a top level Node mount it in the camera
      else
        this._mount(scene.camera.element);

    }

    // Render Children
    for (let child of this.children){
      child.render(scene);
    }
  }

}
