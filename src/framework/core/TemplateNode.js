import Node from '../engine/Node';

// Globals
const CSS_CLASS_TEMPLATE_SURFACE = "hybrid-template-surface";
const CSS_CLASS_SCROLLABLE = "hybrid-scrollable"

/**
 * TemplateNode Class
 *
 * Renders a blaze template into HybridUI Node
 *
 * @class TemplateNode
 * @return {TemplateNode} A new instance of TemplateNode
 */
class TemplateNode extends Node {

  /**
   * @constructor
   */
  constructor (options, data) {
    super(options);

    if (!options) {
      console.log("TemplateNode requires the options param!");
      return false;
    }

    this.options = _.extend({
      classes: []
    }, options);

    if (! data) var data = {};

    this.options.classes = [CSS_CLASS_TEMPLATE_SURFACE, options.template].concat(this.options.classes);

    if (this.options.scrollable)
      this.options.classes.push(CSS_CLASS_SCROLLABLE);

    this.setClasses(this.options.classes);

    if (!Template[options.template]) {
      console.log("Template not found! " + this.options.template);
      return;
    }

    if (this.options.events)
      Template[this.options.template].events(this.options.events);

    if (this.options.helpers)
      Template[this.options.template].helpers(this.options.helpers);

    if (options.created)
      Template[this.options.template].created = this.options.created;

    if (this.options.data)
      data = this.options.data;

    if (this.options.component)
      Template[this.options.template].onCreated(function() {
        this.component = this.options.component;
      });

    Blaze.renderWithData(Template[this.options.template], data, this.element);
  }
}

export TemplateNode;
