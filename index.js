var neliel = {

  /****************************************  math  ****************************************/

  /**
   * accurate adds two numbers.
   *
   * @category Math
   * @param {number} augend The first number in an addition.
   * @param {number} addend The second number in an addition.
   * @param {number} toFixedNumber result to fixed number.
   * @returns {number} Returns the total.
   * @example
   *
   * neliel.add(0.1, 0.7);
   * // => 0.8
   * neliel.add(0.22, 0.91, 2);
   * // => 1.13
   *
   */
  add: function(augend, addend) {
    augend = (augend || 0).toString()
    addend = (addend || 0).toString()
    var arg1Arr = augend.split('.'),
      arg2Arr = addend.split('.'),
      d1 = arg1Arr.length == 2 ? arg1Arr[1] : '',
      d2 = arg2Arr.length == 2 ? arg2Arr[1] : ''
    var maxLen = Math.max(d1.length, d2.length)
    var m = Math.pow(10, maxLen)
    var result = Number(((augend * m + addend * m) / m).toFixed(maxLen))
    var d = arguments[2]
    return typeof d === 'number' ? Number(result.toFixed(d)) : result
  },
  /**
   * accurate subtract two numbers.
   *
   * @category Math
   * @param {number} minuend The first number in a subtraction.
   * @param {number} subtrahend The second number in a subtraction.
   * @param {number} toFixedNumber result to fixed number.
   * @returns {number} Returns the difference.
   * @example
   *
   * neliel.sub(0.8 - 0.1);
   * // => 0.7
   */
  sub: function(minuend, subtrahend) {
    return neliel.add(minuend, -Number(subtrahend), arguments[2])
  },
  /**
   * accurate multiply two numbers.
   *
   * @category Math
   * @param {number} multiplier The first number in a multiplication.
   * @param {number} multiplicand The second number in a multiplication.
   * @param {number} toFixedNumber result to fixed number.
   * @returns {number} Returns the product.
   * @example
   *
   * neliel.mul(0.8, 0.1);
   * // => 0.08
   */
  mul: function(multiplier, multiplicand) {
    var r1 = (multiplier || 0).toString(),
      r2 = (multiplicand || 0).toString(),
      m,
      resultVal,
      d = arguments[2]
    m =
      (r1.split('.')[1] ? r1.split('.')[1].length : 0) +
      (r2.split('.')[1] ? r2.split('.')[1].length : 0)
    resultVal = (Number(r1.replace('.', '')) * Number(r2.replace('.', ''))) / Math.pow(10, m)
    return typeof d !== 'number' ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)))
  },
  /**
   * accurate divide two numbers.
   *
   * @category Math
   * @param {number} dividend The first number in a division.
   * @param {number} divisor The second number in a division.
   * @param {number} toFixedNumber result to fixed number.
   * @returns {number} Returns the quotient.
   * @example
   *
   * neliel.div(0.08, 0.1);
   * // => 0.8
   */
  div: function(dividend, divisor) {
    var r1 = (dividend || 0).toString(),
      r2 = (divisor || 1).toString(),
      m,
      resultVal,
      d = arguments[2]
    m =
      (r2.split('.')[1] ? r2.split('.')[1].length : 0) -
      (r1.split('.')[1] ? r1.split('.')[1].length : 0)
    resultVal = (Number(r1.replace('.', '')) / Number(r2.replace('.', ''))) * Math.pow(10, m)
    return typeof d !== 'number' ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)))
  },

  /****************************************  colloction  ****************************************/

  /**
   * 
   * @param {Array} arrayDatas The array to be converted
   * @param {String} id The unique index of the current object
   * @param {String} pId The unique index of the current object 's parent
   * 
   * @example
   * 
   * neliel.convertArrayToTree([
   *    { name: 'a', id: '1', parentId: '' },
   *    { name: 'b', id: '2', parentId: '1' },
   *    { name: 'c', id: '3', parentId: '1' },
   *    { name: 'd', id: '4', parentId: '2' },
   * ], 'id', 'parentId')
   */
  convertArrayToTree: function(arrayDatas, id, pId) {
    if (!id) id = 'id';
    if (!pId) pId = 'parentId';
    function exists(data, parentId) {
      for (var i = 0; i < data.length; i++) {
        var element = data[i];
        if (element[id] == parentId) return true;
      }
      return false;
    }
  
    var nodes = [];
    // get the top level nodes
    for (var i = 0; i < arrayDatas.length; i++) {
      var row = arrayDatas[i];
      if (!exists(arrayDatas, row[pId])) {
        nodes.push(row);
      }
    }
  
    var toDo = [];
    for (var i = 0; i < nodes.length; i++) {
      toDo.push(nodes[i]);
    }
    while (toDo.length) {
      var node = toDo.shift(); // the parent node
      // get the children nodes
      for (var i = 0; i < arrayDatas.length; i++) {
        var row = arrayDatas[i];
        if (row[pId] == node[id]) {
          var child = row;
          if (node.children) {
            node.children.push(child);
          } else {
            node.children = [child];
          }
          toDo.push(child);
        }
      }
    }
    return nodes;
  },
  /**
   * This method is like `_.uniq` except that it accepts `iteratee` which is
   * invoked for each element in `array` to generate the criterion by which
   * uniqueness is computed. The order of result values is determined by the
   * order they occur in the array. The iteratee is invoked with one argument:
   * (value).
   * 
   * @param {Array} array The array to inspect.
   * @param {String} key The object key to remove duplicate data
   * @example
   * 
   * neliel.uniqBy([1, 2, 3, 2, 1]);
   * // => [1, 2, 3]
   * 
   * neliel.uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
   * // => [{ 'x': 1 }, { 'x': 2 }]
   */
  uniqBy: function(array, key) {
    if (!neliel.isArray(array)) {
      console.error('please pass in Array.');
      return array;
    }
    var arr = [];
    var obj = {};
    array.forEach(function(item, index) {
      var attr = key ? item[key] : item;
      if (!obj[attr]) {
        obj[attr] = index + 1;
        arr.push(item);
      }
    });
    return arr;
  },
  /**
   * judge object is Array or not
   * 
   * @param {Object} object to judge
   */
  isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  },
}

module.exports = neliel
