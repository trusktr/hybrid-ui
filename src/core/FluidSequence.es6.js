var Sequence = HybridUI.components.Sequence;
var Node = HybridUI.engine.Node;

/**
 * FluidSequence Mixin
 *
 * @class FluidSequence
 * @return {FluidSequence} A new instance of FluidSequence
 */
class FluidSequence {

  /**
   * @constructor
   */
  constructor (root, options) {
    this.node = root;
    this.node.items = new Sequence();

    /**
     * Calculates the Position and Sizing properties based on position in collection
     * @param  {Number} i children number in the array
     * @return {Object}          Size, Position, and Align settings for the node
     */
    this.node._calculateNodeProperties = function (i) {
      if (options.calculateNodeProperties && typeof options.calculateNodeProperties == 'function')
        return options.calculateNodeProperties(this, i);
      else
        return {};
    }

    /**
     * Triggers a recalculation and transition of all of the children
     */
    this.node.redraw = _.rateLimit(function () {

      //console.log('FluidSequence', 'Redraw Started');

      async.series([

        // 1. Add New Nodes
        // ---------------------
        function (callback) {
          //console.log('FluidSequence', 'Adding New Nodes');
          var added = [];
          async.each(this.items.getAll(), function (item, callback) {
            if (!item.isMounted()) {
              var position = 1;//this.items.count();
              var p = this._calculateNodeProperties(position);
              p = _.extend(p, this.options.newChild || {});

              // Add Item to scene
              // --------------------
              item._type = "item";
              item.setProperties(p);
              this.addChild(item);
              added.push(item.getLocation());
            }
            callback();
          }.bind(this), function () {
            //console.log('FluidSequence', 'Added New Nodes', added.length);
            callback();
          });
        }.bind(this),


        // 2. Remove Old Nodes
        // ---------------------
        // Remove nodes which are no longer in the Sequence
        function (callback) {
          //console.log('FluidSequence', 'Removing Old Nodes');
          var removed = [];
          var ids = _.pluck(this.items.getAll(), "_id");
          async.each(this._children, function (item, callback) {
            if (item && item._type == "item" && !_.contains(ids, item.getLocation())) {
              removed.push(item.getLocation())
              this.removeChild(item);
            }
            callback();
          }.bind(this), function () {
            //console.log('FluidSequence', 'Removed Old Nodes', removed.length);
            callback();
          }.bind(this));
        }.bind(this),

        // 3. Rearrange Nodes
        // ---------------------
        function (callback) {
          //console.log('FluidSequence', 'Rearranging Nodes');
          var i = 0;

          if (options.reset && typeof options.reset == 'function')
            options.reset(this);

          async.eachSeries(this.items.getAll(), function (item, callback) {
            item.setProperties(this._calculateNodeProperties(i), this.options.transition);
            i++;
            callback();
          }.bind(this), function () {
            //console.log('FluidSequence', 'Rearranged Nodes');
            callback();
          });
        }.bind(this)

      ], function () {
        //console.log('FluidSequence', 'Redraw Complete');
      }.bind(this));
    }, 20);

    this.node.items.onChange = function () {
      this.node.redraw();
    }.bind(this);

    /**f
     * Insert New Child
     * @param  {Node}   node     Child to be inserted into the node
     * @param  {Number} position Optional - position to insert the child
     *
     * TODO: currently position can only be at beggining or end
     */
    this.node.insert = function (node, position) {

      if (!node) {
        console.log('FluidSequence - insert must have a node param');
        return false;
      }

      if (typeof position != 'undefined') {
        var redraw = true;

        if (position === -1)
          var position = 0;

      } else {
        var position = this.items.count();
      }

      var p = this._calculateNodeProperties(position);
      p = _.extend(p, this.options.newChild || {});

      // Add Node to scene
      // --------------------
      var item = new Node(node, p);
      item._type = "item";

      this.items.add(this.addChild(item), position);

      // if (redraw)
      //   this.redraw();
    }
  }
}

HybridUI.components.FluidSequence = FluidSequence;