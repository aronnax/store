[![Build Status](https://travis-ci.org/aronnax/store.svg?branch=feature%2Fes6_map_implementation)](https://travis-ci.org/aronnax/store)

# store
A simple object hash store.

Stores any object you put in. Will use an `id` or `classId` property on the object as the key if 
it exists, otherwise it will use es6 maps to store the object.

## Use
```js
var Store = require('aronnax-store');

var store = Object.create(Store).init();

store.put({s: 1});

var s = store.get({s: 1});
```

## Develop
Written in es6.

Testing
To have the test script watch changed files and run continually use the `testem` command.

```sh
testem
```

Or run the tests and exit

```sh
npm run test
```

Compile down to es5, or as a browserify bundle.

```
npm run compile
npm run compile-bundle
```
