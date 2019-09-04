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


  /****************************************  util  ****************************************/

  /**
   * judge object is Array or not
   * 
   * @param {Object} object to judge
   */
  isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  },

  /**
   * judge value is like zero or not
   * 
   * @param {*} value 
   * @example
   * 
   * neliel.zeroLike('0.000');
   * // => true
   * 
   * neliel.zeroLike(01);
   * // => false
   */
  zeroLike(value) {
    return /^0(.0+)?$/.test(String(value));
  },

  /**
   * fills (modifies) all the elements of an array from a start index
   * (default zero) to an end index (default array length) with a static
   * value. It returns the modified array.
   * 
   * @param {Array} array The array to fill
   * @param {Any} value The value to fill the array
   * @param {Number} start start index, default 0
   * @param {Number} end end index, default array.length
   * @example
   * 
   * neliel.fill([1, 2, 5], 3);
   * // => [3, 3, 3]
   * 
   * neliel.fill([1, 2, 5], 3, 1);
   * // => [1, 3, 3]
   * 
   * neliel.fill([1, 2, 5], 3, -1);
   * // => [1, 2, 3]
   */
  fill(array, value, start, end) {
    if (value == null) {
      throw new TypeError('this is null or not defined');
    } 
    
    var O = Object(array);

    var len = O.length >>> 0;
    
    var relativeStart = start >> 0;

    var k = relativeStart < 0 ?
      Math.max(len + start, 0) :
      Math.min(relativeStart, len);

    var relativeEnd = end === undefined ? len : end >> 0;

    var final = relativeEnd < 0 ?
      Math.max(len + relativeEnd, 0) :
      Math.min(relativeEnd, len);

    while (k < final) {
      O[k] = value;
      k++;
    }

    return O;
  },

  /**
   * 
   * 
   * @param {String || Number} value The value to convert to thousands
   * @param {Number} len The length of decimals to keep
   */
  thousandsFormatter(value, len) {
    var reg = /\d{1,3}(?=(\d{3})+$)/g;
    var integer = String(value).split('.')[0];
    var decimal = String(value).split('.')[1];
    var integer4return = integer.replace(reg, '$&,');
    var decimal4retrun;
    
    if (value == undefined || isNaN(value)) {
      return '0';
    }
    if (len == undefined || isNaN(len) || len <= 0) {
      return integer4return;
    }
    
    var zeroString = neliel.fill(new Array(Math.floor(len)), 0).join('');
    if (neliel.zeroLike(value)) {
      return '0.' + zeroString;
    }

    if (decimal != undefined) {
      var len4decimal = decimal.length;
      if (len4decimal >= len) {
        decimal4retrun = decimal.substring(0, len);
      } else {
        var defaultArray = decimal.split();
        var remainArray = neliel.fill(new Array(len - len4decimal), 0);
        decimal4retrun = defaultArray.concat(remainArray).join('');
      }
      
    } else {
      decimal4retrun = '';
    }
    
    return integer4return + '.' + decimal4retrun;
  },

  /**
   * This method is like `_.clone` except that it recursively clones `value`.
   * 
   * @param {Array || Object} value The value to recursively clone
   */
  cloneDeep(value) {
    if (value === null) return null;
    if (typeof value !== 'object') return value;
    if (value.constructor === Date) return new Date(value);
    if (value.constructor === RegExp) return new RegExp(value);
    var result = neliel.isArray(value) ? [] : {};
    for (var key in value) {
      if (value.hasOwnProperty(key)) {
        if (typeof value[key] === 'object' && value[key] !== null) {
          result[key] = neliel.cloneDeep(value[key]);
        } else {
          result[key] = value[key];
        }
      }
    }
    return result;
  },

  
  /****************************************  string  ****************************************/
  
  /**
   * get the value from url 's query parameter
   * 
   * @param {*} target The key of url 's query parameter
   */
  getUrlQueryParam(target) {
    var queryString = window.location.search.substring(1)
    var arr = queryString.split('&')
    for (var i = 0; i < arr.length; i++) {
      var pair = arr[i].split('=')
      if (pair[0] == target) {
        return pair[1]
      }
    }
    return false
  },


  /****************************************  window  ****************************************/

  /**
   * 
   * @param {String} url The url for a tag to open
   * @param {String} targetType The type of open new window
   * @param {String} id Id for a tag
   * @param {String} download 
   */
  openWindow(url, targetType, id, download) {
    if (!url) return;
    // remove when it exist
    if (document.getElementById(id)) {
      document.body.removeChild(document.getElementById(id))
    }
    var a = document.createElement('a')
    a.setAttribute('href', url)
    if (download) {
      a.setAttribute('download', url)
    }
    a.setAttribute('target', targetType || '_blank')
    a.setAttribute('id', id || 'open')
    document.body.appendChild(a)
    a.click()
  },
}

module.exports = neliel
