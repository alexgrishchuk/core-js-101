/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = function getArea() {
    return this.width * this.height;
  };
}

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  Object.setPrototypeOf(obj, proto);
  return obj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */
function MyElement(value, str, arr) {
  this.arr = arr || [];
  if (this.arr.find((item) => item === 'element')) {
    throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
  }

  this.arr.push('element');
  this.str = `${str}${value}`;
}

function MyId(value, str, arr) {
  this.arr = arr || [];
  if (this.arr.find((item) => item === 'id')) {
    throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
  } else {
    this.arr.push('id');
  }

  this.str = `${str}#${value}`;
}

function MyClass(value, str, arr) {
  this.arr = arr || [];

  this.arr.push('class');
  this.str = `${str}.${value}`;
}

function MyAttr(value, str, arr) {
  this.arr = arr || [];

  this.arr.push('attribute');
  this.str = `${str}[${value}]`;
}

function MyPseudoClass(value, str, arr) {
  this.arr = arr || [];

  this.arr.push('pseudo-class');
  this.str = `${str}:${value}`;
}

function MyPseudoElement(value, str, arr) {
  this.arr = arr || [];
  if (this.arr.find((item) => item === 'pseudo-element')) {
    throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
  }

  this.arr.push('pseudo-element');

  this.str = `${str}::${value}`;
}

function CombineSelector(selector1, combinator, selector2) {
  this.str = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
}

const cssSelectorBuilder = {
  element(value) {
    const obj = new MyElement(value, this.stringify(), this.arr);
    Object.setPrototypeOf(obj, cssSelectorBuilder);
    this.inOrderCheck(obj);
    return obj;
  },

  id(value) {
    const obj = new MyId(value, this.stringify(), this.arr);
    Object.setPrototypeOf(obj, cssSelectorBuilder);
    this.inOrderCheck(obj);
    return obj;
  },

  class(value) {
    const obj = new MyClass(value, this.stringify(), this.arr);
    Object.setPrototypeOf(obj, cssSelectorBuilder);
    this.inOrderCheck(obj);
    return obj;
  },

  attr(value) {
    const obj = new MyAttr(value, this.stringify(), this.arr);
    Object.setPrototypeOf(obj, cssSelectorBuilder);
    this.inOrderCheck(obj);
    return obj;
  },

  pseudoClass(value) {
    const obj = new MyPseudoClass(value, this.stringify(), this.arr);
    Object.setPrototypeOf(obj, cssSelectorBuilder);
    this.inOrderCheck(obj);
    return obj;
  },

  pseudoElement(value) {
    const obj = new MyPseudoElement(value, this.stringify(), this.arr);
    Object.setPrototypeOf(obj, cssSelectorBuilder);
    this.inOrderCheck(obj);
    return obj;
  },

  combine(selector1, combinator, selector2) {
    const obj = new CombineSelector(selector1, combinator, selector2);
    Object.setPrototypeOf(obj, cssSelectorBuilder);
    return obj;
  },

  inOrderCheck(obj) {
    if (obj.arr) {
      const order = {
        element: 0,
        id: 1,
        class: 2,
        attribute: 3,
        'pseudo-class': 4,
        'pseudo-element': 5,
      };
      const arr = Array.from(new Set(obj.arr));
      let prevOrder = 0;
      arr.forEach((item) => {
        if (order[item] < prevOrder) {
          throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
        }
        prevOrder = order[item];
      });
    }
  },

  stringify() {
    return this.str || '';
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
