
/**
 * Module dependencies.
 */

var ComponentNode = require('./lib/component');
var ElementNode = require('./lib/element');
var TextNode = require('./lib/text');
var tree = require('./lib/tree');
var uid = require('get-uid');

/**
 * Exports.
 */

exports.node = dom;
exports.tree = tree;

/**
 * Create virtual DOM trees.
 *
 * This creates the nicer API for the user.
 * It translates that friendly API into an actual tree of nodes.
 *
 * @param {String|Function} type
 * @param {Object} props
 * @param {Array} children
 * @return {Node}
 * @api public
 */

function dom(type, props, children) {

  // Skipped adding attributes and we're passing
  // in children instead.
  if (arguments.length === 2 && (typeof props === 'string' || Array.isArray(props))) {
    children = props;
    props = {};
  }

  children = children || [];
  props = props || {};

  // passing in a single child, you can skip
  // using the array
  if (!Array.isArray(children)) {
    children = [ children ];
  }

  children = children
    .filter(notEmpty)
    .reduce(flatten, [])
    .map(textNodes)
    .map(addIndex);

  // pull the key out from the data.
  var key = props.key;
  delete props.key;

  // if you pass in a function, it's a `Component` constructor.
  // otherwise it's an element.
  var node;
  if ('function' == typeof type) {
    node = new ComponentNode(type, props, key, children);
  } else {
    node = new ElementNode(type, props, key, children);
  }

  // set the unique ID
  node.id = uid();
  node.index = 0;

  return node;
}

/**
 * Remove null/undefined values from the array
 *
 * @param {*} value
 *
 * @return {Boolean}
 */

function notEmpty(value) {
  return value !== null && value !== undefined;
}

/**
 * Flatten nested array
 *
 * @param {Array} arr
 * @param {*} value
 *
 * @return {Array}
 */

function flatten(arr, node) {
  if (Array.isArray(node)) {
    arr = arr.concat(node);
  } else {
    arr.push(node);
  }
  return arr;
}

/**
 * Parse nodes into real `Node` objects.
 *
 * @param {Mixed} node
 * @param {Integer} index
 * @return {Node}
 * @api private
 */

function textNodes(node, index) {
  if (typeof node === 'string' || typeof node === 'number') {
    return new TextNode(String(node));
  } else {
    return node;
  }
}

/**
 * Add an index
 *
 * @param {Node} node
 * @param {Number} index
 *
 * @return {Node}
 */

function addIndex(node, index) {
  node.index = index;
  return node;
}