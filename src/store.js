// Copyright (c) 2013
// All Rights Reserved
// https://github.com/msecret/aronnax
// Licensed MIT

/**
 * @file store Holds the Store module
 */

import 'babel/polyfill';

/**
 * A Store that uses hashing
 * @class Store
 * @extends Base
 */
var Store = {

  /**
   * The accessible data store.
   * @type Object
   */
  get store() {
    return this._dataStore;
  },

  /**
   * The current amount of objects in the store
   * @type Number
   */
  get length() {
    return this._dataStore.size;
  },

  /**
   * Initializes the store
   */
  init: function() {
    this._dataStore = new Map();
  },

  /**
   * Will add a new item to the store, either ID'ed or not
   * @param {Object|Array|Function} item The item to add
   * @returns {Object|Array|Function} The item passed in.
   */
  put(item) {
    let objectKey = item.classId || item.id || null;

    if (objectKey) {
      if (this._dataStore.has(objectKey)) {
        throw new Error('Object key collision occurred, cannot store key');
      } else {
        this._dataStore.set(objectKey, item);
      }
    } else {
      if (this._dataStore.has(item)) {
        throw new Error('Object key collision occurred, cannot store key');
      }
      this._dataStore.set(item, item);
    }

    return item;
  },

  /**
   * Will get the passed in object from the store.
   * @param {Object|Array|Function} item The item to add
   * @returns {Object|Array|Function} The item passed in.
   */
  get(item) {
    var objectKey = item.classId || item.id || null;

    if(objectKey) {
      return this._dataStore.get(objectKey);
    }

    return this._dataStore.get(item);
  },


  /**
   * Removes an item from the data store, if it is found.
   * @param {Object|Array|Function} item The item to remove
   * @returns {Undefined}
   */
  remove(item) {
    var existingItem = this.get(item);

    if (existingItem) {
      let objectKey = item.classId || item.id || null;
      if (objectKey) {
        this._dataStore.delete(objectKey);
      }
      else {
        this._dataStore.delete(item);
      }
      return existingItem;
    }
  }
};

export default Store;
