var Node = HybridUI.engine.Node;

const CSS_CLASS_SWAPPER = 'hybrid-swapper';

/**
 * Swapper Class
 *
 * @class Swapper
 * @return {Swapper} A new instance of Swapper
 */
class Swapper extends Node {

  /**
   * @constructor
   */
  constructor (options) {
    super(this);

    this.setClasses([CSS_CLASS_SWAPPER]);

    this.options = _.extend({}, options);

    this._views = {};
    this._currentView = null;

    if (this.options.views)
      this.options.views.forEach(function (view, i) {
        this.addView(view.name, view.node)
      }.bind(this));
  }

  /**
   * [addView description]
   * @param {[type]} view [description]
   */
  addView (view) {
    // console.log('Swapper add view ', view.slug);
    this._views[view.slug] = this.add(view);
    this._views[view.slug].setPosition(-9999,0,0);
  }

  /**
   * [getView description]
   * @param  {[type]} slug [description]
   * @return {[type]}      [description]
   */
  getView (slug) {
    return this._views[slug];
  }

  /**
   * [getViews description]
   * @return {[type]} [description]
   */
  getViews () {
    return this._views;
  }

  /**
   * [show description]
   * @param  {[type]}   view     [description]
   * @param  {[type]}   options  [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  show (view, options, callback) {

    // console.log('Swapper show ', view.slug);

    if (!this._views[view.slug]) this.addView(view);

    view = this._views[view.slug];
    view.show();

    // If there is a view currently showing in the Swapper
    if (this._currentView && this._currentView !== view.slug) {

      // If transition options
      if (options) {

        // Remove the previous node
        var currentView = this._views[this._currentView];

        options.out.run(currentView, function () {
          currentView.hide();
        }.bind(this));

        // Show the new node
        options.in.run(view, function () {
          if (callback)
            callback();
        });
      }

      // No transition
      else {

        _.each(this._views, function (view) {
          view.hide();
        });

        if (callback)
          callback();
      }
    }

    // If this is the first view to show in the Swapper
    else {
      this._views[view.slug].position.set(0, 0, 0);
    }

    this._currentView = view.slug;
  }
}

HybridUI.components.Swapper = Swapper;