var Node = HybridUI.engine.Node;
var Swapper = HybridUI.components.Swapper;
var Header = HybridUI.components.Header;

/**
 * HeaderFooter Layout
 *
 * @class HeaderFooter
 * @return {HeaderFooter} A new instance of HeaderFooter
 */
class HeaderFooter extends Node {

  /**
   * @constructor
   */
  constructor (options) {
    super(this);

    this.options = _.extend({
      headerSize: 74,
      footerSize: 54
    }, options);

    this.setClasses(['layouts-header-footer']);

    this.sections = {};

    this.createHeader;
    this.createBody;
    this.createFooter;
  }

  createHeader () {
    this.sections.header = this.addChild()
        .setSizeMode('default', 'absolute')
        .setAbsoluteSize(null, this.options.headerSize)
        .addChild(new Header());

    var header = new DOMElement(this.sections.header, {
      classes: ['header']
    });
  }

  createBody () {
    this.sections.body = this.addChild()
        .setDifferentialSize(null, -1 * (this.options.headerSize + this.options.footerSize))
        .setPosition(0, this.options.headerSize)
        .addChild(new Swapper());

    var body = new DOMElement(this.sections.body, {
      classes: ['body']
    });
  }

  createFooter() {
    this.sections.footer = this.addChild()
        .setSizeMode('default', 'absolute')
        .setAbsoluteSize(null, this.options.footerSize)
        .setMountPoint(0, 1)
        .setAlign(0, 1)
        .addChild(new Swapper());

    var footer = new DOMElement(this.sections.footer, {
      classes: ['footer']
    });
  }
}

HybridUI.layouts.HeaderFooter = HeaderFooter;