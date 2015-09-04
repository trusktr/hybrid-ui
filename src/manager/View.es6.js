var TemplateNode = HybridUI.components.TemplateNode;

/**
 * View Class
 *
 * @class View
 * @return {View} A new instance of View
 */
class View {

  /**
   * @constructor
   */
  constructor (name, options, manager, feature) {
    this._name = name;
    this._manager = manager;
    this._feature = feature;
    this.sections = {};

    if (!options.route) {
      console.log("View doesn't have a route property", name);
      return false;
    }

    _.each(options, function (v, k) {
      this[k] = v;
    }.bind(this));

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

    this._addRoute(name, options);
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
      this.view = self;
      this.feature = self._feature;
    };
  }

  /**
   * [_addRoute description]
   * @param {[type]} name    [description]
   * @param {[type]} options [description]
   */
  _addRoute (name, options) {
    var self = this;

    this._manager._router.route(name, {
      path: options.route,
      template: "blank",
      onBeforeAction: function() {

        if (options.onBeforeRender) {
          options.onBeforeRender.call(this);
        }

        if (options.requiresNonAuth || self._feature.requiresNonAuth) {
          if (Meteor.userId()) {
            self._manager._router.go(self._manager._options.authRoute);
          }
        }

        if (options.requiresAuth || self._feature.requiresAuth) {
          if (!Meteor.userId()) {
            self._manager._router.go(self._manager._options.nonAuthRoute);
          }
        }

        self._manager.show(name);

        this.next();
      }
    });
  }

  /**
   * [getFeature description]
   * @return {[type]} [description]
   */
  getFeature () {
    return this._feature;
  }

  /**
   * [getName description]
   * @return {[type]} [description]
   */
  getName () {
    return this._name;
  }

  /**
   * [addSection description]
   * @param {[type]} name    [description]
   * @param {[type]} options [description]
   */
  addSection (name, options) {
    var self = this;

    // Inject Context
    if (options.template) {
      Template[options.template].created = function () {
        this.feature = self._feature;
        this.view = self
      };
    }

    if (options.component)
      this.sections[name] = new options.component(options);
    else
      this.sections[name] = new TemplateNode(options);
  }

}

HybridUI.Manager.prototype.View = View;