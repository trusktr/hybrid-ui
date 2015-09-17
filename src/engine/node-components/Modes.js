import NodeComponent from '../core/NodeComponent';

/**
 * Modes Component
 *
 * @class Modes
 * @extends NodeComponent
 */
export default
class Modes extends NodeComponent {

  /**
   * @constructor
   */
  constructor (root) {
    super();
    
    this.node = root;

    this.node._currentMode = null;

    if (!this.node.options)
      this.node.options = {};

    if (!this.node._modes)
      this.node._modes = [];

    /**
     * Return current mode
     */
    this.node.getCurrentMode = function () {
      var mode = _.find(this._modes, (mode) =>
        return mode.name == this._currentMode;
      );

      if (mode)
        return mode.options;
    }

    /**
     * Return current mode
     */
    this.node.getCurrentModeName = function () {
      return this._currentMode;
    }

    /**
     * Set the mode
     */
    this.node.setMode = function (mode) {
      this._currentMode = mode;
      this.setOptions(this.getCurrentMode());

      if (this.redraw && typeof this.redraw == "function")
        this.redraw();
    }

    /**
     * Get modes by type
     * @param {String} type [description]
     *
     * TODO: Filter size modes & filter by size
     */
    this.node.getModes = function (type) {
      if (!type)
        return this._modes;
      else
        return _.filter(this._modes, function (mode) {
          if (mode.type == type)
            return true
        });
    }

    /**
     * Add responsive sizing mode
     * @param {String} name [description]
     * @param {Object} options [description]
     */
    this.node.addMode = function (name, type, options) {
      this._modes.push({
        name: name,
        type: type,
        options: options
      });
    }

    /**
     * Add an array of responsive sizing modes
     * @param {Array} modes [description]
     */
    this.node.addModes = function (modes) {
      for (mode of modes) {
        this.addMode(mode.name, mode.type, mode.options);
      }
    }
  }
}
