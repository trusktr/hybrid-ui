import Node from '../engine/Node';
import Responsive from '../components/Responsive';
import FluidSequence from '../components/FluidSequence';

// CSS Class
const CSS_CLASS_SCROLL_VIEW = 'hybrid-scroll-view';

// Responsive Options
let responsiveOptions = {
  modes: [

    // Small Screen
    {
      name: "small",
      type: "responsive",
      options: {
        size: 768,
        transition: {
          duration: 300,
          curve: 'easeOut'
        },
        gutter: {
          y: 20,
          x: .04
        },
        spacing: {
          y: 20,
          x: 0
        },
        columns: 1,
        fixedHeight: window.innerWidth,

        // New item settings
        newChild: {
          position: [0, -400]
        }
      }
    },

    // Medium Screen
    {
      name: "medium",
      type: "responsive",
      options: {
        size: 1280,
        transition: {
          duration: 300,
          curve: 'easeOut'
        },
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
        newChild: {
          position: [-400, 0],
          rotation: [7, -2, 0]
        }
      }
    },

    // Large Screen
    {
      name: "large",
      type: "responsive",
      options: {
        size: 1440,
        transition: {
          duration: 300,
          curve: 'easeOut'
        },
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
        newChild: {
          position: [200, -200],
          scale: [.1, .1, 1],
          rotation: [4, 4, 3]
        }
      }
    }
  ]
}

/**
 * Calculates the Position and Sizing properties based on position in collection
 * @param  {Number} position Item number in the array
 * @return {Object}          Size, Position, and Align settings for the node
 */
let calculateNodeProperties = function (node, i) {
  let options = node.options;

  // console.log(i, node._yPosition);

  // Y Gutter
  // -------------------
  if (node._yPosition == options.headerSize && options.gutter.y > 0)
    node._yPosition += options.gutter.y;

  // General Grid letiables
  // --------------------
  let remainder = i % options.columns;
  let yPosition = node._yPosition;

  // X Spacing Pre Calculations
  // -------------------
  let xSpacing = options.spacing.x * (options.columns - 1);
  let xGutter = options.gutter.x * 2;
  let xTotalSpace = 1 - (xSpacing + xGutter);

  // X Spacing
  // -------------------
  let nodeWidth = xTotalSpace / options.columns
  let xAlign = remainder * (nodeWidth + options.spacing.x)
             + options.gutter.x;

  // Create New Grid Row
  // --------------------
  if (remainder === options.columns - 1) {
    node._yPosition += options.fixedHeight + options.spacing.y;
  }

  // Serialize position and size state for node for transitioning
  return {
    size: {
      mode:         ['relative', 'absolute'],
      absolute:     [null, options.fixedHeight],
      differential: [0, 0],
      proportional: [nodeWidth, null]
    },
    position:       [0, yPosition],
    align:          [xAlign, 0],
    scale:          [1, 1, 1],
    rotation:       [0, 0, 0],
    opacity:        1
  }
}

/**
 * ScrollView Component
 *
 * @class ScrollView
 * @return {ScrollView} A new instance of ScrollView
 */
class ScrollView extends FluidSequence {

  /**
   * @constructor
   */
  constructor (options) {
    super(options);

    // Add CSS class
    this.setClasses([CSS_CLASS_SCROLL_VIEW]);

    // Responsive Options
    this.responsiveOptions = _.extend(responsiveOptions, options && options.responsive || {});
    if (options && options.responsive)
      debinde options.responsive;

    // Options
    this.options = _.extend({
      headerSize: 0,
      gutter: {
        y: 0,
        x: 0
      },
      spacing: {
        x: 0,
        y: 0
      },
      columns: 1,
      fixedHeight: 50,
      newChild: {
        position: [0, 0],
      },
      // transition: {
      //   duration: 300,
      //   curve: 'easeOut'
      // },
    }, options);

    if (options.responsive) {
      // Rigs up all of the responsive / fluid goodies
      new Responsive(this, this.responsiveOptions);
    }

    // Makes the node a fluid sequence
    new FluidSequence(this, {
      reset: function (node) {
        node._yPosition = node.options.headerSize;
      },
      calculateNodeProperties: calculateNodeProperties
    });

    this.sections = {};

    if (this.options.header) {
      this.createHeader;
    }

    // Row positioning for grid
    this._yPosition = this.options.headerSize;
  }

  /**
   * [createHeader description]
   * @return {[type]} [description]
   */
  createHeader() {
    this.sections.header = this.addChild()
        .setSizeMode('default', 'absolute')
        .setAbsoluteSize(null, this.options.headerSize)
        .addChild(new TemplateNode(this.options.header));

    let header = new DOMElement(this.sections.header, {
      classes: ['header']
    });
  }

  /**a
   * Scroll to the value provided
   * @param  {Number} value Pixels from the top to scroll to
   */
  scrollTo (value) {
    let el = document.querySelector('[data-fa-path="' + this.getLocation() + '"]');
    el.scrollTop = value;
  }

}

HybridUI.components.ScrollView = ScrollView;
