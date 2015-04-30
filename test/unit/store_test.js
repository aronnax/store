/**
 *
 * Created by msecret on 4/29/15.
 */

import redtape from 'redtape';
import sinon from 'sinon';

import Store from '../../src/store';

var sandbox,
    store;

var test = redtape({
  beforeEach: (cb) => {
    store = Object.create(Store);
    store.init();
    sandbox = sinon.sandbox.create();
    cb();
  },
  afterEach: (cb) => {
    sandbox.restore();
    cb();
  }
});

/* =============================
 * init()
 * =============================
 */
test('init() should create a private dataStore property', t => {
  store.init();

  t.ok(store._dataStore, 'the data store is defined');
  t.ok(store.store, 'store attribute is defined');

  t.end();
});

/* =============================
 * stringify()
 * =============================
 */
test('stringify() should stringy an array by concatting all values', t => {
  var testArray = ['value1', 'value2'],
      stringedArray = store.stringify(testArray);

  t.equal(stringedArray, testArray[0] + '*' + testArray[1], 'Returns a stringed version' +
    'of the array');

  t.end();
});

test('stringify() should stringify a function by compiling a string of it', t => {
  var testFunction = function(arg1) { return arg1; },
      stringedFunc = store.stringify(testFunction);

  t.equal(stringedFunc, 'function testFunction(arg1) {\n    return arg1;\n  }',
    'returns a full string of the function');

  t.end();
});

test('should stringify an object by JSON stringifying it', t => {
  var testObj = {'testProp1': 1},
      sttingedObj = store.stringify(testObj);

  t.equal(sttingedObj, JSON.stringify(testObj), 'returns a JSON stringified object');

  t.end();
});

/* =============================
 * put()
 * =============================
 */
test('should return the item put in', t => {
  var testObj = { },
      storeItem;

  storeItem = store.put(testObj);

  t.equal(storeItem, testObj, 'item put in is the same');

  t.end();
});

test('should put an IDd object into the data store by id', t => {
  var testObj = {
      id: 1,
      testProp: 'test'
    },
    storeItem;

  store.put(testObj);
  storeItem = store._dataStore[1];

  t.equal(storeItem, testObj, 'item put in is the same');

  t.end();
});

test('should throw a key collision error if two objects with the same id' +
    'are stored', t => {
  var testObj = {
      id: 1,
      testProp: 'test'
    };

  store.put(testObj);
  t.equal(store._dataStore[1], testObj);

  t.end();
});

test('should put a non IDd object with an array', t => {
  var testArray = ['sdf'],
    storeArray,
    stringedArray;

  store.put(testArray);
  stringedArray = store.stringify(testArray);
  storeArray = store._dataStore[stringedArray];

  t.ok(Array.isArray(storeArray), 'it\'s an array');
  t.equal(storeArray.length, 1, 'store array length is 1')

  t.end();
});

test('should put a non IDd object onto the array', t => {
  var testArray = ['sdf'],
      storeArray,
      stringedArray;

  store.put(testArray);
  stringedArray = store.stringify(testArray);
  storeArray = store._dataStore[stringedArray][0];

  t.equal(storeArray, testArray, 'array in store is same as one passed in')

  t.end();
});

test('should push objects that are equal onto the array', t => {
  var testArray = ['sdf'],
    testVal,
    stringedArray;

  store.put(testArray);
  stringedArray = store.stringify(testArray);
  testVal = store._dataStore[stringedArray][0];

  t.equal(testVal, testArray, 'arrays are the same');

  store.put(testArray);
  stringedArray = store.stringify(testArray);
  testVal = store._dataStore[stringedArray][1];

  t.equal(testVal, testArray, 'arrays are still the same');

  t.end();
});

test('should put a non IDd function onto the array', t => {
  var testFunction = function moon() { return 1; },
    storeResult,
    stringedFunc;

  store.put(testFunction);
  stringedFunc = store.stringify(testFunction);
  storeResult = store._dataStore[stringedFunc][0];

  t.equal(storeResult, testFunction, 'returns same function as put in');

  t.end();
});

test('should put a non IDd object onto the array', t => {
  var testObject = {'test': 'testa'},
      storeResult,
      stringedObject;

  store.put(testObject);
  stringedObject = store.stringify(testObject);
  storeResult = store._dataStore[stringedObject][0];

  t.equal(storeResult, testObject, 'returns object put in');

  t.end();
});

/* =============================
 * get()
 * =============================
 */
test('should get an IDd object thats in the store', t => {
  var testObj1 = {
      id: 1
    },
    testObj2 = {
      id: 2
    };

  store.put(testObj1);
  store.put(testObj2);

  t.equal(store.get(testObj1), testObj1, 'getting object returns it');
  t.equal(store.get(testObj2), testObj2, 'getting another object returns it');

  t.end();
});

test('should return nothing for an IDd object not in the store', t => {
  var testObj1 = {
      id: 1
    },
    storeResult;

  storeResult = store.get(testObj1);
  t.ok(!storeResult, 'Returns undefined');

  t.end();
});

test('should get a non IDd object thats in the store', t => {
  var testArray1 = ['moon'],
    testArray2 = ['soom'];

  store.put(testArray1);
  store.put(testArray2);

  t.equal(store.get(testArray1), testArray1, 'arrays are the same');
  t.equal(store.get(testArray2), testArray2, 'arrays are the same');

  t.end();
});

test('should return none for a non IDd object not in the store', t => {
  var testArray1 = ['moon'];

  t.ok(!store.get(testArray1), 'returns undefined');

  t.end();
});

 /* =============================
 * remove()
 * =============================
 */
test('should remove a found IDd item from the store', t => {
  var testObj = {
    id: 1
  };

  store.put(testObj);
  t.equal(store.get(testObj), testObj, 'returns test object');
  t.equal(store._dataStore[1], testObj, 'returns test object');

  store.remove(testObj);
  t.ok(!store.get(testObj), 'returns undefined');
  t.ok(!store._dataStore[1], 'returns undefined');

  t.end();
});

test('should remove a found non IDd item from the store', t => {
  var testArr1 = ['sdf'],
    testArr2 = ['sdfg'];

  store.put(testArr1);
  t.equal(store.get(testArr1), testArr1, 'arrays the same')
  store.put(testArr2);
  t.equal(store.get(testArr2), testArr2, 'arrays the same')

  store.remove(testArr1);
  t.ok(!store.get(testArr1), 'return undefined');
  t.equal(store.get(testArr2), testArr2, 'second arry still defined')

  store.remove(testArr2);
  t.ok(!store.get(testArr2), 'return undefined');

  t.end();
});

test('should remove one item from a non IDd item when there are multiple',
  t => {
  var testArr1 = ['asd'],
      testArr2 = ['asd'],
      arrStr = store.stringify(testArr1);

  store.put(testArr1);
  store.put(testArr2);

  t.equal(store._dataStore[arrStr].length, 2, 'data store has length of 2');

  store.remove(testArr1);
  t.equal(store._dataStore[arrStr].length, 1, 'data store has length of 1');

  store.remove(testArr2);
  t.equal(store._dataStore[arrStr].length, 0, 'data store has length of 1');

  t.end();
});

/* =============================
 * length()
 * =============================
 */
test('should start out at zero', t => {
  t.equal(store.length, 0, 'store length property is 0');
  t.end();
});

test('should return the amount of objects in the store when added', t => {
  var testObj1 = {
      id: 1
    },
    testObj2 = {
      id: 2
    };

  store.put(testObj1);
  t.equal(store.length, 1, 'length property equals 1');
  store.put(testObj2);
  t.equal(store.length, 2, 'length property equals 2');

  t.end();
});

test('should return the amount of objects in the store when removed',
    t => {
  var testObj1 = {
      id: 1
    },
    testObj2 = {
      id: 2
    };

  store.put(testObj1);
  store.put(testObj2);
  t.equal(store.length, 2, 'length property is 2');

  store.remove(testObj1);
  t.equal(store.length, 1, 'length property is 1');

  t.end();
});
