var inherit = require('./inherit');
var object = require('./object');

/**
 * Create a new instance of class renderer
 *
 * @class geo.renderer
 * @extends geo.object
 * @returns {geo.renderer}
 */
var renderer = function (arg) {
  'use strict';

  if (!(this instanceof renderer)) {
    return new renderer(arg);
  }
  object.call(this);

  arg = arg || {};
  var m_this = this,
      m_layer = arg.layer === undefined ? null : arg.layer,
      m_canvas = arg.canvas === undefined ? null : arg.canvas,
      m_initialized = false;

  /**
   * Get layer of the renderer
   *
   * @returns {*}
   */
  this.layer = function () {
    return m_layer;
  };

  /**
   * Get canvas for the renderer
   */
  this.canvas = function (val) {
    if (val === undefined) {
      return m_canvas;
    } else {
      m_canvas = val;
      m_this.modified();
    }
  };

  /**
   * Get map that this renderer belongs to
   */
  this.map = function () {
    if (m_layer) {
      return m_layer.map();
    } else {
      return null;
    }
  };

  /**
   * Get/Set if renderer has been initialized
   */
  this.initialized = function (val) {
    if (val === undefined) {
      return m_initialized;
    } else {
      m_initialized = val;
      return m_this;
    }
  };

  /**
   * Get render API used by the renderer
   */
  this.api = function () {
    throw new Error('Should be implemented by derived classes');
  };

  /**
   * Reset to default
   */
  this.reset = function () {
    return true;
  };

  /**
   * Initialize
   */
  this._init = function () {
  };

  /**
   * Handle resize event
   */
  this._resize = function () {
  };

  /**
   * Render
   */
  this._render = function () {
  };

  return this;
};

inherit(renderer, object);
module.exports = renderer;