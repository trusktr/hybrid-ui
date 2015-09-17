/**
 * Sequence Class
 *
 * @class Sequence
 * @return {Sequence} A new instance of Sequence
 */
class Sequence {

  /**
   * @constructor
   */
  constructor () {
    this._items = [];
  }

  /**
   * Method to add item to sequence
   *
   * @method
   * @memberof Sequence
   * @param {Object} item item to insert into sequence
   * @param {Number} position index in sequence
   * @return {null}
   */
  add (item, position) {
    if (position && position === -1) {
      var method = 'unshift';
    } else {
      var method = 'push';
    }

    this._items[method](item);
  }

  /**
   * Method to get count of items
   *
   * @method
   * @memberof Sequence
   * @return {Number} count of items in sequence
   */
  count () {
    return this._items.length;
  };

  /**
   * Method to get items in sequence
   *
   * @method
   * @memberof Sequence
   * @return {Object} items
   */
  getAll () {
    return this._items;
  }

  /**
   * Method to get a specific item
   *
   * @method
   * @memberof Sequence
   * @param {Number} i index of item to get
   * @return {Object} item
   */
  get (i) {
    return this._items[i];
  }

  /**
   * Method to sort the sequence
   *
   * @method
   * @memberof Sequence
   */
  sortBy (field, direction) {
    var direction = direction || 1;
    this._items = _.sortBy(this._items, function(item) { return item.node[field] * direction; });
    this.onChange();
  }

  /**
   * Method to remove all items from sequence
   *
   * @method
   * @memberof Sequence
   */
  clear () {
    this._items = [];
    this.onChange();
  }

  /**
   * Method to reset the items in sequence to the array passed in
   *
   * @method
   * @memberof Sequence
   * @param {Array} items items to be added to sequence
   */
  set (items) {
    this._items = items;
    this.onChange();
  }

  /**
   * Method to be called when the sequence is changed
   *
   * @method
   * @memberof Sequence
   */
  onChange () {}

}


HybridUI.components.Sequence = Sequence;
