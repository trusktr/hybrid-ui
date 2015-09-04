TemplateSurface = HybridUI.components.TemplateSurface;

/**
 * Component Class
 *
 * @class Component
 * @return {Component} A new instance of Component
 */
class Component {

  /**
   * @constructor
   */
  constructor (name, options, manager) {
    _.each(options, function (v, k) {
      this[k] = v;
    }.bind(this));

    this._name = name;
    this._manager = manager;

    if (this.template && this.events) {
      this._registerEvents();

      delete this.events;
    }

    if (this.template && this.helpers) {
      this._registerHelpers();

      delete this.helpers;
    }

    if (this.template && this.rendered) {
      this._registerRendered();

      delete this.rendered;
    }

    if (this.template)
      this._injectContext();
  }

  /**
   * [_registerRendered description]
   * @return {[type]} [description]
   */
  _registerRendered () {
    Template[this.template].rendered = this.rendered;
  }

  /**
   * [_registerEvents description]
   * @return {[type]} [description]
   */
  _registerEvents () {
    Template[this.template].events(this.events);
  }

  /**
   * [_registerHelpers description]
   * @return {[type]} [description]
   */
  _registerHelpers () {
    Template[this.template].helpers(this.helpers);
  }

  /**
   * [_injectContext description]
   * @return {[type]} [description]
   */
  _injectContext () {
    var self = this;

    Template[this.template].created = function () {
      this.component = self;
    };
  }

  /**
   * [create description]
   * @param  {[type]} data    [description]
   * @param  {[type]} context [description]
   * @return {[type]}         [description]
   */
  create (data, context) {

    if (context)
      data.component = context;

    return new TemplateSurface({template: this.template}, data);
  }
}

HybridUI.Manager.prototype.Component = Component;