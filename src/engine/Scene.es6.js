var Renderer = HybridUI.engine.Renderer;

/**
 * Scene Class
 * @class Scene
 * @return {Scene} A new instance of Scene
 */
class Scene {

  /**
   * @constructor
   */
  constructor () {
    this._width = window.innerWidth;
    this._height = window.innerHeight;
    this._domParent = 'body';

    // Add Scene
    this._scene = new THREE.Scene();

    // Add Camera
    this._camera = new THREE.PerspectiveCamera(40, this._width / this._height, 1, 10000);
    this._camera.position.z = 3000;

    // Add Renderer
    this._renderer = new Renderer();
    this._renderer.setSize(this._width, this._height);

    // Inject Scene into DOM
    $(this._domParent).append(this._renderer.domElement);

    // Register window resize hook
    window.addEventListener('resize', this._onWindowResize.bind(this), false);

    // Add Controlls
    this.addTrackballControls();

    // Start the update loop
    this.update();
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
   * Method to render the scene
   *
   * @method
   * @memberof Scene
   * @return {null}
   */
  render () {
    this._renderer.render(this._scene, this._camera);
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
   * Method to run on window resize
   *
   * @method
   * @memberof Scene
   * @return {null}
   */
  _onWindowResize () {
    this._width = window.innerWidth;
    this._height = window.innerHeight;

    this._camera.aspect = this._width / this._height;
    this._camera.updateProjectionMatrix();

    this._renderer.setSize(this._width, this._height);

    this.render();
  }

  /**
   * Method to add trackball controls for 3D navigation
   *
   * @method
   * @memberof Scene
   * @return {null}
   */
  addTrackballControls () {
    this._controls = new THREE.TrackballControls(this._camera, this._renderer.domElement);
    this._controls.rotateSpeed = 0.5;
    this._controls.minDistance = 500;
    this._controls.maxDistance = 6000;
    this._controls.addEventListener('change', this.render.bind(this));
  }
}

HybridUI.engine.Scene = Scene;

