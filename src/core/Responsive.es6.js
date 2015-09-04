var Modes = HybridUI.components.Modes;

// Globals
const SMALL_BREAKPOINT = 768;
const MEDIUM_BREAKPOINT = 1280;
const LARGE_BREAKPOINT = 1440;

// Default Options
var defaultModes = [

  // Small Screen
  {
    name: "small",
    type: "responsive",
    options: {
      size: SMALL_BREAKPOINT,
      transition: {
        duration: 300,
        curve: 'easeOut'
      }
    }
  },

  // Medium Screen
  {
    name: "medium",
    type: "responsive",
    options: {
      size: MEDIUM_BREAKPOINT,
      transition: {
        duration: 300,
        curve: 'easeOut'
      }
    }
  },

  // Large Screen
  {
    name: "large",
    type: "responsive",
    options: {
      size: LARGE_BREAKPOINT,
      transition: {
        duration: 300,
        curve: 'easeOut'
      }
    }
  }
]

/**
 * Responsive Mixin
 *
 * @todo Custom break points
 * @todo Physics
 *
 * @class Responsive
 * @return {Responsive} A new instance of Responsive
 */
class Responsive {

  /**
   * @constructor
   */
  constructor (root, options) {
    Modes.apply(this, arguments);

    this.node = root;

    this.node.addModes(options && options.modes || defaultModes);

    /**
     * Gets the current screen class size
     * @return {String} small || medium || large
     */
    this.node._sizeModeTest = function (x) {
      var x = x || window.innerWidth;
      var m = this.getModes('responsive');

      for (var i = 0; i < m.length; i++) {

        // Smallest Size
        if (i === 0 && x <= m[i].options.size) {
          return m[i].name;
        }

        // Largest Size
        else if (i === m.length && x > m[i -1].options.size) {
          return m[i].name;
        }

        // All other sizes
        else if (i > 0 && x > m[i -1].options.size && x <= m[i].options.size) {
          return m[i].name;
        }

      }
    }

    /**
     * Watch for change in size of scrollview and if it breaks into a new
     * screen class size trigger a redraw
     */
    this.node._watchSizeChange = function () {
      this.onSizeChange = _.debounce(function (x, y, z) {
        if (!x) {
          return false;
        }

        var currentMode = this.getCurrentModeName();
        var newMode = this._sizeModeTest(x);

        if (currentMode != newMode) {
          this.setMode(newMode);
          this.redraw();
        }
      }.bind(this), 100);
    }

    // Watch size change for responsive settings
    this.node.setMode(this.node._sizeModeTest());
    this.node._watchSizeChange();
  }
}

HybridUI.components.Responsive = Responsive;