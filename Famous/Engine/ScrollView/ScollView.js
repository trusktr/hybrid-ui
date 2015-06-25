/**
 * ScrollView Component
 *
 * TODO: True Sized Items
 * TODO: Diffing data sets
 */

var Node = require('famous/core/Node');
var DOMElement = require('famous/dom-renderables/DOMElement');
var Position = require('famous/components/Position');
var Align = require('famous/components/Align');
var Rotation = require('famous/components/Rotation');
var Scale = require('famous/components/Scale');
var Size = require('famous/components/Size');
var _ = require('lodash');

// Globals
var SMALL_BREAKPOINT = 768;
var MEDIUM_BREAKPOINT = 1280;
var LARGE_BREAKPOINT = 1440;

/**
 * Constructor
 *
 * options: TODO Documentation
 */
function ScrollView (options) {
  Node.call(this);

  this.options = _.extend(this._defaultOptions, options);

  this.setProportionalSize(1,1);

  // Default Style
  this.el = new DOMElement(this).setProperty('overflow-y', 'scroll')
                                .setProperty('overflow-x', 'hidden')
                                .setProperty('-webkit-overflow-scrolling', 'touch');

  // Set ScrollView Style
  _.forEach(this.options.style, function (v, k) {
    this.el.setProperty(k , v);
  }.bind(this));

  // Items
  this._items = []

  // Row positioning for grid
  this._yPosition = 0;

  // Watch size change for responsive settings
  this._currentSize = this._getCurrentSize();
  this._watchSizeChange();

}

ScrollView.prototype = Object.create(Node.prototype);

// Default Options
ScrollView.prototype._defaultOptions = {
  style: {

  },

  fluid: {
    duration: 300,
    curve: 'easeOut'
  },

  // Small Screen
  small: {
    gutter: {
      y: 20,
      x: .04
    },
    spacing: {
      y: 20,
      x: 0
    },
    columns: 1,
    fixedHeight: 400,

    // New item settings
    newItem: {
      position: [0, -400]
    }
  },

  // Medium Screen
  medium: {
    gutter: {
      y: 40,
      x: .05
    },
    spacing: {
      y: 40,
      x: .05
    },
    columns: 2,
    fixedHeight: 300,

    // New item settings
    newItem: {
      position: [-400, -400]
    }
  },

  // Large Screen
  large: {
    gutter: {
      y: 50,
      x: .05
    },
    spacing: {
      y: 50,
      x: .05
    },
    columns: 4,
    fixedHeight: 200,

    // New item settings
    newItem: {
      position: [-400, -400]
    }
  }
}

/**
 * Watch for change in size of scrollview and if it breaks into a new
 * screen class size trigger a redraw
 */
ScrollView.prototype._watchSizeChange = function () {
  this.onSizeChange = _.debounce(function (x, y, z) {
    if (!x) {
      return false;
    }

    if (x <= SMALL_BREAKPOINT && this._currentSize != 'small') {
      this._currentSize = 'small';
      this._redraw();
    } else if (x > SMALL_BREAKPOINT && x <= MEDIUM_BREAKPOINT && this._currentSize != 'medium') {
      this._currentSize = 'medium';
      this._redraw();
    } else if (x > MEDIUM_BREAKPOINT && this._currentSize != 'large') {
      this._currentSize = 'large';
      this._redraw();
    }
  }, 100);
}

/**
 * Triggers a recalculation and transition of all of the items
 */
ScrollView.prototype._redraw = function () {
  this._yPosition = 0;

  for(var i=0; i<this._items.length; i++) {
    this._redrawItem(i);
  }
}

ScrollView.prototype._redrawItem = function (i) {
  var item = this._items[i];
  var p = this._calculateNodeProperties(i);
  var t = {
    duration: this.options.fluid.duration,
    curve: this.options.fluid.curve
  };

  item.position.set(    p.position[0],          p.position[1],           0, t);
  item.align.set(       p.align[0],             p.align[1],              0, t);
  item.size
  .setDifferential(     p.size.differential[0], p.size.differential[1],  0, t)
  .setProportional(     p.size.proportional[0], p.size.proportional[1],  0, t)
  .setAbsolute(         p.size.absolute[0],     p.size.absolute[1],      0, t);
}


/**
 * Gets the current screen class size
 * @return {String} small || medium || large
 */
ScrollView.prototype._getCurrentSize = function () {
  var width = window.innerWidth;

  if      (width <= SMALL_BREAKPOINT)  return 'small';
  else if (width <= MEDIUM_BREAKPOINT) return 'medium';
  else if (width > MEDIUM_BREAKPOINT)  return 'large';
}

/**
 * Calculates the Position and Sizing properties based on position in collection
 * @param  {Number} position Item number in the array
 * @return {Object}          Size, Position, and Align settings for the node
 */
ScrollView.prototype._calculateNodeProperties = function (position) {

  // Get the options for the screen size
  var options = this.options[this._currentSize];

  // Y Gutter
  // -------------------
  if (this._yPosition == 0 && options.gutter.y > 0)
    this._yPosition = options.gutter.y;

  // General Grid Variables
  // --------------------
  var remainder = position % options.columns;
  var yPosition = this._yPosition;

  // X Spacing Pre Calculations
  // -------------------
  var xSpacing = options.spacing.x * (options.columns - 1);
  var xGutter = options.gutter.x * 2;
  var xTotalSpace = 1 - (xSpacing + xGutter);

  // X Spacing
  // -------------------
  var nodeWidth = xTotalSpace / options.columns
  var xAlign = remainder * (nodeWidth + options.spacing.x)
             + options.gutter.x;

  // Create New Grid Row
  // --------------------
  if (remainder === options.columns - 1) {
    this._yPosition += options.fixedHeight + options.spacing.y;
  }

  // Serialize position and size state for node for transitioning
  return {
    size: {
      mode: ['relative', 'absolute'],
      absolute: [null, options.fixedHeight],
      differential: [0, 0],
      proportional: [nodeWidth, null]
    },
    position: [0, yPosition],
    align: [xAlign, 0]
  }
}


/**
 * Insert New Item
 * @param  {Node}   node     Item to be inserted into the ScrollView
 * @param  {Number} position Optional - position to insert the item
 *
 * TODO: currently position doesn't do anything -- working on this
 */
ScrollView.prototype.insert = function (node, position) {

  if (position && position === -1) {
    var method = 'unshift';
    var position = 0;
    var newItem = this.options[this._currentSize].newItem;
  } else {
    var method = 'push';
    var position = this._items.length;
    var newItem = {
      position: []
    };
  }

  var p = this._calculateNodeProperties(position);

  // Add Node to scene
  // --------------------
  var item = this.addChild();
  item
  .setSizeMode(         p.size.mode[0],         p.size.mode[1]         )
  .setAbsoluteSize(     p.size.absolute[0],     p.size.absolute[1]     )
  .setDifferentialSize( p.size.differential[0], p.size.differential[1] )
  .setProportionalSize( p.size.proportional[0], p.size.proportional[1] )
  .setPosition(         newItem.position[0] || p.position[0],  newItem.position[1] || p.position[1])
  .setAlign(            p.align[0],             p.align[1]             );

  // Store Item
  this._items[method]({
    align:    new Align(item),
    position: new Position(item),
    size:     new Size(item),
    node:     item.addChild(node)
  });

  if (method == 'unshift')
    this._redraw();
}

module.exports = ScrollView;
