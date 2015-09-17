import Utility from '../core/Utility';

// CSS Class
const CSS_CLASS_CAMERA = 'hybrid-dom-camera';

/**
 * Camera Class
 *
 * @class Camera
 */
export default
class Camera {

  /**
   * @constructor
   */
  constructor () {
    this.fov = 0;
    this._style = '';
    this._width = window.innerWidth;
    this._height = window.innerHeight;

    // Properties
    this._properties = {
      align: []
    }

    // Style Cache
    this._styleCache = {
      transform: {
        matrix3d: []
      }
    };

    // Elements
    this.element = document.createElement('div');
    this.element.className = CSS_CLASS_CAMERA;

    // Camera
    this._camera = new THREE.PerspectiveCamera(40, this._width / this._height, 1, 10000);
    this._camera.position.z = 3000;
  }

  /**
   * [applyStyle description]
   *
   * @method
   * @private
   * @memberOf Camera
   * @param  {[type]} property [description]
   * @param  {[type]} value    [description]
   */
  _applyStyle (property, value) {
    this.element.style[property] = value;
  }

  /**
   * [applyTransform description]
   *
   * @method
   * @private
   * @memberOf Camera
   */
  _applyTransform (){
    let align = this._properties.align;
    let matrix3d = this._styleCache.transform.matrix3d;

    let transform = `
      translate3d(
        0,
        0,
        ${ Utility.applyCSSLabel(align, 'px') }
      )

      matrix3d(
        ${ Utility.epsilon(  matrix3d[0]  ) },
        ${ Utility.epsilon(- matrix3d[1]  ) },
        ${ Utility.epsilon(  matrix3d[2]  ) },
        ${ Utility.epsilon(  matrix3d[3]  ) },
        ${ Utility.epsilon(  matrix3d[4]  ) },
        ${ Utility.epsilon(- matrix3d[5]  ) },
        ${ Utility.epsilon(  matrix3d[6]  ) },
        ${ Utility.epsilon(  matrix3d[7]  ) },
        ${ Utility.epsilon(  matrix3d[8]  ) },
        ${ Utility.epsilon(- matrix3d[9]  ) },
        ${ Utility.epsilon(  matrix3d[10] ) },
        ${ Utility.epsilon(  matrix3d[11] ) },
        ${ Utility.epsilon(  matrix3d[12] ) },
        ${ Utility.epsilon(- matrix3d[13] ) },
        ${ Utility.epsilon(  matrix3d[14] ) },
        ${ Utility.epsilon(  matrix3d[15] ) }
      )

      translate3d(
        ${ Utility.applyCSSLabel(align, 'px') },
        ${ Utility.applyCSSLabel(align, 'px') },
        0
      )
    `;

    this._applyStyle('transform', transform);
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
    if (true || ! _.isEqual(this._styleCache.transform.matrix3d, matrix)) {
      this._styleCache.transform.matrix3d = matrix;
      this._applyTransform();
    }
  }

  /**
   * [setAlign description]
   *
   * @method
   * @memberOf Camera
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
   * [setSize description]
   *
   * @method
   * @memberOf Camera
   * @param {Number} width  [description]
   * @param {Number} height [description]
   */
  setSize (width, height) {
    this._width = width;
    this._height = height;

    this._applyStyle('width', width + 'px');
    this._applyStyle('height', height + 'px');
  }

  /**
   * [get description]
   *
   * @method
   * @memberOf Camera
   */
  get () {
    return this._camera;
  }

  /**
   * [setSize description]
   *
   * @method
   * @memberOf Renderer
   */
  render (){
    if (this._camera.parent === undefined) this._camera.updateMatrixWorld();
    this._camera.matrixWorldInverse.getInverse(this._camera.matrixWorld);

    this._setMatrix3d(this._camera.matrixWorldInverse.elements);
  }

}
