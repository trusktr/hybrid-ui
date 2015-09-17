/**
 * Transition Class
 *
 * @class Transition
 * @return {Transition} A new instance of Transition
 */
class Transition {

  /**
   * @constructor
   *
   * @param {Object} options [description]
   */
  constructor (options) {
    this.options = _.extend({
      duration: 200,
      curve: 'ExponentialInOut',
      steps: []
    }, options);
  }

  /**
   * Run Transtiion
   *
   * @method run
   * @memberOf Transition
   * @param  {Node} node [description]
   * @return {null}
   */
  run (node) {

    var steps = Array.prototype.slice.call(this.options.steps);

    // if (direction === -1)
    //   steps.reverse();

    // Init Step
    node.setProperties(steps[0].properties);

    // Additional Steps
    var steps = steps.slice(1, steps.length);

    // Animate Steps
    _.each(steps, function (step) {

      // Invert percent
      // if (direction === -1 && step.percent === 0)
      //   step.percent = 1;

      var transition = {
        duration: this.options.duration * step.percent,
        curve: this.options.curve
      }

      node.setProperties(step.properties, transition);

    }.bind(this));
  }
}

export Transition;
