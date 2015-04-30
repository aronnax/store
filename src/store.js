/**
 * Created by msecret on 4/29/15.
 */

// Copyright (c) 2013
// All Rights Reserved
// https://github.com/msecret/aronnax
// Licensed MIT

/**
 * @file store Holds the Store module
 */

/**
 * Takes any object and creates a string representation of it.
 * @private
 * @param {Object|Array|Function} obj The object to stringify
 * @returns {String} The string representation of the object.
 */
function objectToString(obj) {
  if (Array.isArray(obj)) {
    return obj.join('*');
  }
  else if (typeof obj === 'function') {
    return obj.toString();
  }
  else if ((typeof obj === 'object') && (obj !== null)) {
    return JSON.stringify(obj);
  }
  else {
    return obj.toString();
  }
}

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
  // TODO Cache this, flush cache on changes.
  get length() {
    return Object.keys(this._dataStore).length;
  },

  /**
   * Initializes the store
   */
  init: function() {
    this._dataStore = {};
  },

  /**
   * Will add a new item to the store, either ID'ed or not
   * @param {Object|Array|Function} item The item to add
   * @returns {Object|Array|Function} The item passed in.
   */
  put(item) {
    let objectKey = item.classId || item.id || null;

    if (objectKey) {
      let storedVal = this._dataStore[objectKey];
      if (storedVal) {
        throw new Error('Object key collision occurred, cannot store key');
      } else {
        this._dataStore[objectKey] = item;
      }
    } else {
      objectKey = this.stringify(item);
      let storedVal = this._dataStore[objectKey];
      if (!storedVal) {
        this._dataStore[objectKey] = [];
      }
      this._dataStore[objectKey].push(item);
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
      return this._dataStore[objectKey];
    }

    objectKey = this.stringify(item);
    let storedVal = this._dataStore[objectKey];
    return storedVal && storedVal[0] || null;
  },

  /**
   * Creates a string representation of an object
   * @param {Array|Object|Funciton} item The item to stringify
   * @returns {String} The string representation
   */
  stringify(item) {
    return objectToString(item);
  },

  /**
   * Removes an item from the data store, if it is found.
   * @param {Object|Array|Function} item The item to remove
   * @returns {Undefined}
   */
  // TODO Parts of this just reuse the gets functionality
  remove(item) {
    var existingItem = this.get(item);

    if (existingItem) {
      let objectKey = item.classId || item.id || null;
      if (objectKey) {
        delete this._dataStore[objectKey];
      }
      else {
        objectKey = this.stringify(item);
        return this._dataStore[objectKey].pop();
      }
      return existingItem;
    }
  }
};

export default Store;
