var Node = HybridUI.engine.Node;
var Sprite = HybridUI.engine.Sprite;

// Utility Functions
// ---------------------

/**
 * [epsilon description]
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
var epsilon = function (value) {
  return Math.abs(value) < 0.000001 ? 0 : value;
}

/**
 * [getCameraCSSMatrix description]
 * @param  {[type]} matrix [description]
 * @return {[type]}        [description]
 */
var getCameraCSSMatrix = function (matrix) {

  var elements = matrix.elements;

  return `matrix3d(
    ${epsilon(  elements[0]  )},
    ${epsilon(- elements[1]  )},
    ${epsilon(  elements[2]  )},
    ${epsilon(  elements[3]  )},
    ${epsilon(  elements[4]  )},
    ${epsilon(- elements[5]  )},
    ${epsilon(  elements[6]  )},
    ${epsilon(  elements[7]  )},
    ${epsilon(  elements[8]  )},
    ${epsilon(- elements[9]  )},
    ${epsilon(  elements[10] )},
    ${epsilon(  elements[11] )},
    ${epsilon(  elements[12] )},
    ${epsilon(- elements[13] )},
    ${epsilon(  elements[14] )},
    ${epsilon(  elements[15] )}
  )`;

}

/**
 * [getObjectCSSMatrix description]
 * @param  {[type]} matrix [description]
 * @return {[type]}        [description]
 */
var getObjectCSSMatrix = function (matrix) {

  var elements = matrix.elements;

  return `translate3d(-50%,-50%,0) matrix3d(
    ${epsilon(  elements[0]  )},
    ${epsilon(  elements[1]  )},
    ${epsilon(  elements[2]  )},
    ${epsilon(  elements[3]  )},
    ${epsilon(- elements[4]  )},
    ${epsilon(- elements[5]  )},
    ${epsilon(- elements[6]  )},
    ${epsilon(- elements[7]  )},
    ${epsilon(  elements[8]  )},
    ${epsilon(  elements[9]  )},
    ${epsilon(  elements[10] )},
    ${epsilon(  elements[11] )},
    ${epsilon(  elements[12] )},
    ${epsilon(  elements[13] )},
    ${epsilon(  elements[14] )},
    ${epsilon(  elements[15] )}
  )`;
}

const CSS_CLASS_RENDERER = 'hybrid-dom-renderer';
const CSS_CLASS_CAMERA = 'hybrid-dom-camera';

/**
 * Renderer Class
 * @class Renderer
 * @return {Renderer} A new instance of Renderer
 */
class Renderer {

  /**
   * @constructor
   */
  constructor () {
    this._width = null;
    this._height = null;
    this._widthHalf = null;
    this._heightHalf = null;

    this.matrix = new THREE.Matrix4();

    this.cache = {
      camera: { fov: 0, style: '' },
      objects: {}
    };

    this.domElement = document.createElement('div');
    this.domElement.className = CSS_CLASS_RENDERER;

    this.cameraElement = document.createElement('div');
    this.cameraElement.className = CSS_CLASS_CAMERA;

    this.domElement.appendChild(this.cameraElement);
  }

  /**
   * [setSize description]
   *
   * @method
   * @memberOf Renderer
   * @param {[type]} width  [description]
   * @param {[type]} height [description]
   */
  setSize (width, height) {
    this._width = width;
    this._height = height;

    this._widthHalf = this._width / 2;
    this._heightHalf = this._height / 2;

    this.domElement.style.width = width + 'px';
    this.domElement.style.height = height + 'px';

    this.cameraElement.style.width = width + 'px';
    this.cameraElement.style.height = height + 'px';
  }

  /**
   * [render description]
   *
   * @method
   * @memberOf Renderer
   * @param  {[type]} scene  [description]
   * @param  {[type]} camera [description]
   * @return {[type]}        [description]
   */
  render (scene, camera) {

    var fov = 0.5 / Math.tan(THREE.Math.degToRad(camera.fov * 0.5 )) * this._height;

    if (this.cache.camera.fov !== fov) {
      this.domElement.style.WebkitPerspective = fov + "px";
      this.domElement.style.MozPerspective = fov + "px";
      this.domElement.style.oPerspective = fov + "px";
      this.domElement.style.perspective = fov + "px";

      this.cache.camera.fov = fov;
    }

    scene.updateMatrixWorld();

    if (camera.parent === undefined) camera.updateMatrixWorld();

    camera.matrixWorldInverse.getInverse( camera.matrixWorld );

    var style = `translate3d(0,0,${fov}px) ${getCameraCSSMatrix(camera.matrixWorldInverse)}
      translate3d(${this._widthHalf}px,${this._heightHalf}px, 0)`;

    if ( this.cache.camera.style !== style ) {
      this.cameraElement.style.WebkitTransform = style;
      this.cameraElement.style.MozTransform = style;
      this.cameraElement.style.oTransform = style;
      this.cameraElement.style.transform = style;

      this.cache.camera.style = style;
    }

    this.renderObject( scene, camera );
  }

  /**
   * [renderObject description]
   *
   * @method
   * @memberOf Renderer
   * @param  {[type]} object [description]
   * @param  {[type]} camera [description]
   * @return {[type]}        [description]
   */
  renderObject (object, camera) {

    if (object instanceof Node) {

      var style;

      if (object instanceof Sprite) {

        // http://swiftcoder.wordpress.com/2008/11/25/constructing-a-billboard-matrix/

        this.matrix.copy(camera.matrixWorldInverse);
        this.matrix.transpose();
        this.matrix.copyPosition(object.matrixWorld);
        this.matrix.scale(object.scale);

        this.matrix.elements[3] = 0;
        this.matrix.elements[7] = 0;
        this.matrix.elements[11] = 0;
        this.matrix.elements[15] = 1;

        style = getObjectCSSMatrix(this.matrix);

      } else {
        style = getObjectCSSMatrix(object.matrixWorld);
      }

      var element = object.element;
      var cachedStyle = this.cache.objects[object.id];

      if (cachedStyle === undefined || cachedStyle !== style) {
        element.style.WebkitTransform = style;
        element.style.MozTransform = style;
        element.style.oTransform = style;
        element.style.transform = style;

        this.cache.objects[object.id] = style;
      }

      if (element.parentNode !== this.cameraElement) {
        this.cameraElement.appendChild(element);
      }

    }

    for ( var i = 0, l = object.children.length; i < l; i ++ ) {
      this.renderObject(object.children[ i ], camera);
    }
  }
}

HybridUI.engine.Renderer = Renderer;