var Node = HybridUI.engine.Node;

const CSS_CLASS_PROGRESS_BAR = 'hybrid-progress-bar';

/**
 * ProgressBar Component
 *
 * @class ProgressBar
 * @return {ProgressBar} A new instance of ProgressBar
 */
class ProgressBar extends Node {

  /**
   * @constructor
   */
  constructor () {

    this.setClasses([CSS_CLASS_PROGRESS_BAR]);

    // this.setSizeMode("relative", "absolute")
    //   .setProportionalSize(1, null)
    //   .setAbsoluteSize(null, 0);

    // this.progressBar = this.addChild()
    //   .setSizeMode("relative", "relative")
    //   .setProportionalSize(0, 1)

    // var text = this.addChild()
    //   .setSizeMode("relative", "relative")
    //   .setProportionalSize(1, 1)
    //   .setPosition(0, 9);
  }

  /**
   * [setText description]
   * @param {[type]} text [description]
   */
  setText (text) {
    //this.textEl.setContent(text);
  }

  /**
   * [setProgress description]
   */
  setProgress () {
    // this.element.setProperty('background', "#222")
    // nodeSize.setAbsolute(0, 40, 0);

    // proggressBarSize.setProportional(uploads[0].progress/100, 1, 0, {duration: 100});
  }
}

HybridUI.components.ProgressBar = ProgressBar;