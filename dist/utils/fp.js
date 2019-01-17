import { reduce, assign, map, toPairs, flow, curry, groupBy } from 'lodash/fp'; // Group a list by accumulating all items that match on `by` into a single
// list item containing the `by` value. The result is a list of objects
// of the following shape:
//
//    {
//      by: <any>,
//      items: [ <any> ]
//    }
//
//  Implementation note: The use of JSON encoding to manage the group keys
//  (and, not coincidentally, to pass the bulk of the work off to `groupBy`)
//  is unsound and potentially inefficient, but very, very convenient. Shame.
//  Sounder to use a WeakMap to accumulate the groups.

export var groupByGeneral = curry(function (by, list) {
  return flow(groupBy(function (item) {
    return JSON.stringify(by(item));
  }), toPairs, map(function (pair) {
    return {
      by: JSON.parse(pair[0]),
      items: pair[1]
    };
  }))(list);
});
export var mapWithKey = map.convert({
  cap: false
}); // Return the "union" of a list of objects. "Union" here means assigning all
// properties of the objects to a single, initially empty, result object.
// If a property occurs in more than one object in the list, the last
// occurrence wins (as in `assign`).

export var objUnion = reduce(function (result, value) {
  return assign(result, value);
}, {});