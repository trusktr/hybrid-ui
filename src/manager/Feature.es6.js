/**
 * Feature Class
 *
 * @class Feature
 * @return {Feature} A new instance of Feature
 */
class Feature {

  /**
   * @constructor
   */
  constructor (name, options, manager) {
    _.each(options, function (v, k) {
      this[k] = v;
    }.bind(this));

    this._name = name;
    this._manager = manager;
  }

  /**
   * [addView description]
   * @param {[type]} name    [description]
   * @param {[type]} options [description]
   */
  addView (name, options) {
    this._manager.views[name] = new this._manager.View(name, options, this._manager, this);
    return this._manager.views[name];
  }

  /**
   * [getName description]
   * @return {[type]} [description]
   */
  getName () {
    return this._name;
  }

}

HybridUI.Manager.prototype.Feature = Feature;