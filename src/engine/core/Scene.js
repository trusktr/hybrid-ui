import Camera from '../components/Camera';
import Utility from '../Utility';

// CSS Class
const CSS_CLASS_SCENE  = 'hybrid-dom-scene';

/**
 * Scene Class
 *
 * @class Scene
 */
export default
class Scene {

  /**
   * @constructor
   */
  constructor () {
    this._width = 0;
    this._height = 0;

    // DOM Element
    this.element = document.createElement('div');
    this.element.className = CSS_CLASS_SCENE;

    // Add Scene
    this._scene = new THREE.Scene();

    // Add Camera
    this.camera = new Camera();

    // Append camera element to scene
    this.element.appendChild(this.camera.element);

    // Mount Scene
    window.onload = =>
      this._mount(document.body);

    // Set Size
    this.setSize(window.innerWidth, window.innerHeight);

    // Register window resize hook
    window.addEventListener('resize', this._onWindowResize.bind(this), false);

    // Add Controlls
    this.addTrackballControls();

    // Start the update loop
    this.update();
  }


  /**
   * [applyStyle description]
   *
   * @method
   * @private
   * @memberOf Scene
   * @param  {String} property [description]
   * @param  {String} value    [description]
   */
  _applyStyle (property, value) {
    this.element.style[property] = value;
  }

  /**
   * Inject scene into DOM
   *
   * @method
   * @private
   * @memberOf Scene
   */
  _mount (parentElement) {
    parentElement.appendChild(this.element);
  }

  /**
   * Method to run on window resize
   *
   * @method
   * @memberof Scene
   * @return {null}
   */
  _onWindowResize () {
    this._width = window.innerWidth;
    this._height = window.innerHeight;

    var camera = this.camera.get();

    camera.aspect = this._width / this._height;
    camera.updateProjectionMatrix();

    this.setSize(this._width, this._height);

    this.render();
  }


  /**
   * Method to add child node to the scene
   *
   * @method
   * @memberof Scene
   * @return {null}
   */
  addChild (object) {
    this._scene.add(object);
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
  render () {
    var camera = this.camera.get();

    var fov = 0.5 / Math.tan(THREE.Math.degToRad(camera.fov * 0.5 )) * this._height;

    if (this.camera.fov !== fov) {
      this._applyStyle('perspective', fov + "px");
      this.camera.fov = fov;
    }

    this._scene.updateMatrixWorld();

    this.camera.render();
    this.camera.setAlign([this._width / 2, this._height / 2, fov]);

    for (var child of this._scene.children){
      child.render(this);
    }
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

    this._applyStyle('width', width + 'px');
    this._applyStyle('height', height + 'px');

    this.camera.setSize(width, height)
  }

  /**
   * Method to update the scene
   *
   * @todo Currently running this.render() on every frame.. node changes should be passed up
   * so we know when to run render and when not to.
   *
   * @method
   * @memberof Scene
   * @return {null}
   */
  update () {
    requestAnimationFrame(this.update.bind(this));
    TWEEN.update();
    this.render();
    this._controls.update();
  }

  /**
   * Method to add trackball controls for 3D navigation
   *
   * @method
   * @memberof Scene
   * @return {null}
   */
  addTrackballControls () {
    this._controls = new THREE.TrackballControls(this.camera.get(), this.element);
    this._controls.rotateSpeed = 0.5;
    this._controls.minDistance = 500;
    this._controls.maxDistance = 6000;
    this._controls.addEventListener('change', this.render.bind(this));
  }
}
