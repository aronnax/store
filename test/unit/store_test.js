/**
 *
 * Created by msecret on 4/29/15.
 */

import functionBind from 'function-bind';
import redtape from 'redtape';
import sinon from 'sinon';

import Store from '../../src/store';

Function.prototype.bind = functionBind;

var sandbox,
    store;

var test = redtape({
  beforeEach: (cb) => {
    store = Object.create(Store);
    sandbox = sinon.sandbox.create();
    cb();
  },
  afterEach: (cb) => {
    sandbox.restore();
    cb();
  }
});

/* =============================
 * put()
 * =============================
 */
test('put() should return the item put in', t => {
  var testObj = { },
      storeItem;

  storeItem = store.put(testObj);

  t.equal(storeItem, testObj, 'item put in is the same');

  t.end();
});

test('put() should put an IDd object into the data store by id', t => {
  var testObj = {
      id: 1,
      testProp: 'test'
    },
    storeItem;

  store.put(testObj);
  storeItem = store.store.get(testObj.id);

  t.equal(storeItem, testObj, 'item put in is the same');

  t.end();
});

test('put() should throw a key collision error if two objects with the same id' +
    'are stored', t => {
  t.plan(2);
  var testObj = {
      id: 1,
      testProp: 'test'
    };

  store.put(testObj);
  t.equal(store.get(testObj), testObj);
  t.throws(store.put, testObj);
});

test('put() should put a non IDd object into store', t => {
  var testArray = ['sdf'],
      actual;

  store.put(testArray);
  actual = store.get(testArray);

  t.equal(actual, testArray, 'puts correct item into store');

  t.end();
});

test('put() should put a non IDd object into', t => {
  var expected = {test: 1};

  store.put(expected);
  let actual = store.get(expected);
  t.equal(actual, expected, 'returns correct object put in');

  t.end();
});

test('put() should push objects that are equal into store', t => {
  var expected1 = {test: 1},
      expected2 = {test: 1};

  store.put(expected1);
  let actual = store.get(expected1);
  t.equal(actual, expected1, 'returns correct object put in');

  store.put(expected2);
  actual = store.get(expected2);
  t.equal(actual, expected2, 'returns 2nd correct object put in');

  t.end();
});

test('put() should put a non IDd function into store', t => {
  var testFunction = function moon() { return 1; },
      actual;

  store.put(testFunction);
  actual = store.get(testFunction);

  t.equal(actual, testFunction, 'returns same function as put in');

  t.end();
});

/* =============================
 * get()
 * =============================
 */
test('get() should get an IDd object thats in the store', t => {
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

test('get() should return nothing for an IDd object not in the store', t => {
  var testObj1 = {
      id: 1
    },
    storeResult;

  storeResult = store.get(testObj1);
  t.ok(!storeResult, 'Returns undefined');

  t.end();
});

test('get() should get a non IDd object thats in the store', t => {
  var testArray1 = ['moon'],
    testArray2 = ['soom'];

  store.put(testArray1);
  store.put(testArray2);

  t.equal(store.get(testArray1), testArray1, 'arrays are the same');
  t.equal(store.get(testArray2), testArray2, 'arrays are the same');

  t.end();
});

test('get() should return none for a non IDd object not in the store', t => {
  var testArray1 = ['moon'];

  t.ok(!store.get(testArray1), 'returns undefined');

  t.end();
});

 /* =============================
 * remove()
 * =============================
 */
test('remove() should remove a found IDd item from the store', t => {
  var testObj = {
    id: 1
  };

  store.put(testObj);
  t.equal(store.get(testObj), testObj, 'returns test object');

  store.remove(testObj);
  t.ok(!store.get(testObj), 'returns undefined');

  t.end();
});

test('remove() should remove a found non IDd item from the store', t => {
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

/* =============================
 * length()
 * =============================
 */
test('length() should start out at zero', t => {
  t.equal(store.length, 0, 'store length property is 0');
  t.end();
});

test('length() should return the amount of objects in the store when added', t => {
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

test('length() should return the amount of objects in the store when removed',
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
