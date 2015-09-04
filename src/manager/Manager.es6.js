var Swapper = HybridUI.components.Swapper;
var Transition = HybridUI.components.Transition;
var Scene = HybridUI.engine.Scene;
var Node = HybridUI.engine.Node;

/**
 * Manager Class
 *
 * @class Manager
 * @return {Manager} A new instance of Manager
 */
class Manager {

  /**
   * @constructor
   */
  constructor (options, defaults) {

    // Current State
    this._currentLayout = null;
    this._currentView = null;
    this._preloaded = false;

    // Past State
    this._previousView = null;
    this._previousFeatureView = null;

    // Holder Objects
    this.layouts = {};
    this.features = {};
    this.views = {};
    this.components = {};
    this._transitions = DEFAULT_TRANSITIONS;

    this._wait = 50;

    // Options
    this._options = _.extend({
      // Defaut Options
    }, options);

    // Defaults
    _.each(defaults, function (defaults, type) {
      if (type == "layouts") {
        _.each(defaults, function (layout, name) {
          this.addLayout(name, layout);
        }.bind(this));
      } else {
        this[type] = defaults;
      }
    }.bind(this));

    // Famous
    this._scene = new Scene();
    this._swapper = this._scene.addChild(new Swapper());
  }

  /**
   * [addLayout description]
   * @param {[type]} name   [description]
   * @param {[type]} layout [description]
   * @param {[type]} slug   [description]
   */
  addLayout (name, layout, slug) {

    layout.prototype.getName = function () {
      return name;
    };

    this.layouts[name] = {
      layout: layout
    };

    if (slug)
      this.layouts[name].slug = slug;
  }

  /**
   * [addFeature description]
   * @param {[type]} name    [description]
   * @param {[type]} options [description]
   */
  addFeature (name, options) {
    this.features[name] = new this.Feature(name, options, this);
    return this.features[name];
  }

  /**
   * [addComponent description]
   * @param {[type]} name    [description]
   * @param {[type]} options [description]
   */
  addComponent (name, options) {
    this.components[name] = new this.Component(name, options, this);
    return this.components[name];
  }

  /**
   * [addTransition description]
   * @param {[type]} name       [description]
   * @param {[type]} transition [description]
   */
  addTransition (name, transition) {
      this.transitions[name] = transition;
  }

  /**
   * [setLayout description]
   * @param {[type]} name    [description]
   * @param {[type]} feature [description]
   */
  setLayout (name, feature) {
    var layout = this.loadLayout(name, feature);
    this._currentLayout = layout.slug;
  }

  /**
   * [getLayout description]
   * @param  {[type]} name [description]
   * @return {[type]}      [description]
   */
  getLayout (name) {
    if (!this.layouts[name]) {
      console.log('Manager', 'Layout not found!', name);
      return false;
    }

    return this.layouts[name].layout;
  }

  /**
   * [loadLayout description]
   * @param  {[type]} name    [description]
   * @param  {[type]} feature [description]
   * @param  {[type]} options [description]
   * @return {[type]}         [description]
   */
  loadLayout (name, feature, options) {

    var slug = this.layouts[name].slug;

    if (!slug)
      slug = name + feature;

    // Layout already exists
    if (this._swapper.getView(slug)) {
      layout = this._swapper.getView(slug);
    }

    // Add new Layout instance
    else {
      var layout = this.getLayout(name);

      if (options)
        layout = new layout();
      else
        layout = new layout(options);

      layout.slug = slug;
      layout.el.addClass(feature);
      this._swapper.addView(layout);
    }

    return layout;
  }

  /**
   * [getSectionSlug description]
   * @param  {[type]} name [description]
   * @return {[type]}      [description]
   */
  getSectionSlug (name) {
    return this._currentView + name;
  }

  /**
   * [getCurrentLayout description]
   * @return {[type]} [description]
   */
  getCurrentLayout () {
    return this._swapper.getView(this._currentLayout);
  }

  /**
   * [getCurrentView description]
   * @return {[type]} [description]
   */
  getCurrentView () {
    return this.views[this._currentView];
  }

  /**
   * [getPreviousView description]
   * @return {[type]} [description]
   */
  getPreviousView () {
    if (this._previousView)
      return this.views[this._previousView];
  }

  /**
   * [getCurrentFeature description]
   * @return {[type]} [description]
   */
  getCurrentFeature () {
    return this.views[this._currentView]._feature;
  }

  /**
   * [getPreviousFeatureView description]
   * @return {[type]} [description]
   */
  getPreviousFeatureView () {
    return this._previousFeatureView;
  }

  /**
   * [getTransition description]
   * @param  {[type]} name      [description]
   * @param  {[type]} direction [description]
   * @return {[type]}           [description]
   */
  getTransition (name, direction) {
    if (!this._transitions[name]) {
      console.log('Manager', 'Transition not found! ', name);
      return false;
    }

    return this._transitions[name][direction];
  }

  /**
   * [preloadViews description]
   * @return {[type]} [description]
   */
  preloadViews () {
    _.each(this.views, function (view) {

      var feature = view.getFeature().getName();

      // Preload Layout
      if (view.layout)
        var layout = this.loadLayout(view.layout, feature, view.layoutOptions);
      else if (view.getFeature().layout)
        var layout = this.loadLayout(view.getFeature().layout, feature, view.getFeature().layoutOptions);
      else
        var layout = this.loadLayout("Full", feature);

      _.each(view.sections, function (section, name) {

        section.slug = view._name + name;

        // Util function for finding nested Swapper
        function index(obj,i) {return obj[i]}

        // Layout Swapper
        var swapper = ("sections." + name).split('.').reduce(index, layout);
        swapper.addView(section);

        //console.log('Manager', 'Preloading section:', section.slug);

      });

      // Preload View
      //console.log('Manager', 'Preloading view:', view._name);

    }.bind(this));

    this._preloaded = true;
  }

  /**
   * [show description]
   * @param  {[type]} name [description]
   * @return {[type]}      [description]
   */
  show (name) {
    var transition = null,
        view = this.views[name],
        transitionLayout = false,
        transitionFeature = false;

    // console.log('Manager', 'show ' + name);

    if (!view) {
      console.log('Manager', 'View not found', name);
      return false;
    }

    // Set current view
    this._previousView = this._currentView;
    this._currentView = name;

    // Get the feature
    var feature = this.getCurrentFeature();

    // Set Previous feature if feature has changed
    if (this.getPreviousView() && this.getPreviousView().getFeature() != feature) {
      this._previousFeatureView = this._previousView;
      transitionFeature = true;
    }

    // Determine Layout
    // TODO Spit into method
    // -----------------------------

    // Layout defined on View
    if (view.layout) {

      // First layout
      if (!this.getCurrentLayout()) {
        this.setLayout(view.layout, feature.getName());
        transitionLayout = true;
      }

      // Layout Change
      else if (this.getCurrentLayout().getName() != view.layout) {
        this.setLayout(view.layout, feature.getName());
        transitionLayout = true;
      }

    }

    // Layout defined on feature
    else if (feature.layout) {

      // First layout
      if (!this.getCurrentLayout()) {
        this.setLayout(feature.layout, feature.getName());
        transitionLayout = true;
      }

      // Layout Change
      else if (this.getCurrentLayout().getName() != feature.layout) {
        this.setLayout(feature.layout, feature.getName());
        transitionLayout = true;
      }

    }

    // No Layout defined
    else {
      this.setLayout("Full", feature.getName());
      transitionLayout = true;
    }

    // Get the layou
    var layout = this.getCurrentLayout();

    // onExit Hook
    if (view.onExit) {
      view.onExit();
    }

    // Transition the layouts / features
    if (transitionLayout) {

      // Check to see if the incoming feature has a transition declaration
      if (feature.featureTransition)
        var inFeatureTransition = feature.featureTransition

      // Check to see if the outgoing feature has a transition declaration
      if (transitionFeature && this.getPreviousView().getFeature() && this.getPreviousView().getFeature().featureTransition)
        var outFeatureTransition = this.getPreviousView().getFeature().featureTransition

      // If the incoming or outgoing feature have transitions defined determine which one to use based on weight
      if (inFeatureTransition || outFeatureTransition) {

        if (inFeatureTransition && outFeatureTransition) {

          inFeatureTransition.weight = inFeatureTransition.weight || 1;
          outFeatureTransition.weight = outFeatureTransition.weight || 1;

          if (outFeatureTransition.weight > inFeatureTransition.weight)
            var featureTransition = outFeatureTransition;
          else
            var featureTransition = inFeatureTransition;
        }

        else if (inFeatureTransition) {
          var featureTransition = inFeatureTransition;
        }

        else if (outFeatureTransition) {
          var featureTransition = outFeatureTransition;
        }
      }

      // If not use the default feature transition
      else {
        var featureTransition = this._options.featureTransition;
      }

      var currentIndex = featureTransition.order.indexOf(this._currentView);
      var previousIndex = featureTransition.order.indexOf(this._previousView);
      var direction = (currentIndex < previousIndex) ? 1 : 0;
      var transition = this.getTransition(featureTransition.transition, direction);
      var size = [window.innerWidth, window.innerHeight];

      this._swapper.show(layout, {in: transition.in(size), out: transition.out(size)}, function () {
        if (view.onAfterTransition) {
          view.onAfterTransition.call({
            layout: layout
          });
        }
      });

      // onRender
      if (view.onRender) {
        view.onRender.call({
          layout: layout
        });
      }
    } else {
      if (view.onRender) {
        view.onRender.call({
          layout: layout
        });
      }
      if (view.onAfterTransition) {
        view.onAfterTransition.call({
          layout: layout
        });
      }
    }


    setTimeout(function () {
      // Transition View Sections inside layout
      _.each(view.sections, function (section, sectionName) {
        var transition = null, size;

        section.slug = this.getSectionSlug(sectionName);

        // Util function for finding nested Swapper
        function index(obj,i) {return obj[i]}

        // Layout Swapper
        var swapper = ("sections." + sectionName).split('.').reduce(index, layout);

        if (!swapper) {
          console.log("Manager", "The section (" + sectionName + ") does not exist in the layout.");
          return false;
        }


        // If transitioning layou don't transition view
        if (transitionLayout) {
          var viewTransition = false;
        }

        // Check to see if the feature has a view transition declaration
        else if (feature.viewTransition) {
          var viewTransition = {
            order: feature.viewTransition.order
          };

          // Handle section transitions
          if (feature.viewTransition.sectionTransitions) {
            viewTransition.transition = feature.viewTransition.sectionTransitions[sectionName];
          }

          // Handle general transition
          else {
            viewTransition.transition = feature.viewTransition.transition;
          }
        }

        else {
          var viewTransition = this._options.featureTransition;
        }

        if (viewTransition) {

          var currentIndex = viewTransition.order.indexOf(this._currentView);
          var previousIndex = viewTransition.order.indexOf(this._previousView);
          var direction = (currentIndex < previousIndex) ? 1 : 0;
          var transition = this.getTransition(viewTransition.transition, direction);

          var swapperOptions = {in: transition.in(swapper.getSize()), out: transition.out(swapper.getSize())}

        } else {
          var swapperOptions = false;
        }

        // Render Section
        swapper.show(section, swapperOptions, function () {
          if (section.onAfterTransition) {
            section.onAfterTransition.call({
              layout: layout,
              view: section
            });
          }
        });

        // onRender Hook
        if (section.onRender) {
          section.onRender.call({
            layout: layout,
            view: renderable
          });
        }

      }.bind(this));

    }.bind(this), this._wait);

    if (!this._preloaded)
      this.preloadViews();

  }
}

HybridUI.Manager = Manager;