import DiffContext from '../contexts/diff';

import lcs from './lcs';

const ARRAY_MOVE = 3;

const isArray =
  typeof Array.isArray === 'function' ? Array.isArray : a => a instanceof Array;

const arrayIndexOf =
  typeof Array.prototype.indexOf === 'function'
    ? (array, item) => array.indexOf(item)
    : (array, item) => {
      let length = array.length;
      for (let i = 0; i < length; i++) {
        if (array[i] === item) {
          return i;
        }
      }
      return -1;
    };

function arraysHaveMatchByRef(array1, array2, len1, len2) {
  for (let index1 = 0; index1 < len1; index1++) {
    let val1 = array1[index1];
    for (let index2 = 0; index2 < len2; index2++) {
      let val2 = array2[index2];
      if (index1 !== index2 && val1 === val2) {
        return true;
      }
    }
  }
}

function matchItems(array1, array2, index1, index2, context) {
  let value1 = array1[index1];
  let value2 = array2[index2];
  if (value1 === value2) {
    return true;
  }
  if (typeof value1 !== 'object' || typeof value2 !== 'object') {
    return false;
  }
  let objectHash = context.objectHash;
  if (!objectHash) {
    // no way to match objects was provided, try match by position
    return context.matchByPosition && index1 === index2;
  }
  let hash1;
  let hash2;
  if (typeof index1 === 'number') {
    context.hashCache1 = context.hashCache1 || [];
    hash1 = context.hashCache1[index1];
    if (typeof hash1 === 'undefined') {
      context.hashCache1[index1] = hash1 = objectHash(value1, index1);
    }
  } else {
    hash1 = objectHash(value1);
  }
  if (typeof hash1 === 'undefined') {
    return false;
  }
  if (typeof index2 === 'number') {
    context.hashCache2 = context.hashCache2 || [];
    hash2 = context.hashCache2[index2];
    if (typeof hash2 === 'undefined') {
      context.hashCache2[index2] = hash2 = objectHash(value2, index2);
    }
  } else {
    hash2 = objectHash(value2);
  }
  if (typeof hash2 === 'undefined') {
    return false;
  }
  return hash1 === hash2;
}

export const diffFilter = function arraysDiffFilter(context) {
  if (!context.leftIsArray) {
    return;
  }

  let matchContext = {
    objectHash: context.options && context.options.objectHash,
    matchByPosition: context.options && context.options.matchByPosition,
  };
  let commonHead = 0;
  let commonTail = 0;
  let index;
  let index1;
  let index2;
  let array1 = context.left;
  let array2 = context.right;
  let len1 = array1.length;
  let len2 = array2.length;

  let child;

  if (
    len1 > 0 &&
    len2 > 0 &&
    !matchContext.objectHash &&
    typeof matchContext.matchByPosition !== 'boolean'
  ) {
    matchContext.matchByPosition = !arraysHaveMatchByRef(
      array1,
      array2,
      len1,
      len2
    );
  }

  // separate common head
  while (
    commonHead < len1 &&
    commonHead < len2 &&
    matchItems(array1, array2, commonHead, commonHead, matchContext)
  ) {
    index = commonHead;
    child = new DiffContext(context.left[index], context.right[index]);
    context.push(child, index);
    commonHead++;
  }
  // separate common tail
  while (
    commonTail + commonHead < len1 &&
    commonTail + commonHead < len2 &&
    matchItems(
      array1,
      array2,
      len1 - 1 - commonTail,
      len2 - 1 - commonTail,
      matchContext
    )
  ) {
    index1 = len1 - 1 - commonTail;
    index2 = len2 - 1 - commonTail;
    child = new DiffContext(context.left[index1], context.right[index2]);
    context.push(child, index2);
    commonTail++;
  }
  let result;
  if (commonHead + commonTail === len1) {
    if (len1 === len2) {
      // arrays are identical
      context.setResult(undefined).exit();
      return;
    }
    // trivial case, a block (1 or more consecutive items) was added
    result = result || {
      _t: 'a',
    };
    for (index = commonHead; index < len2 - commonTail; index++) {
      result[index] = [array2[index]];
    }
    context.setResult(result).exit();
    return;
  }
  if (commonHead + commonTail === len2) {
    // trivial case, a block (1 or more consecutive items) was removed
    result = result || {
      _t: 'a',
    };
    for (index = commonHead; index < len1 - commonTail; index++) {
      result[`_${index}`] = [array1[index], 0, 0];
    }
    context.setResult(result).exit();
    return;
  }
  // reset hash cache
  delete matchContext.hashCache1;
  delete matchContext.hashCache2;

  // diff is not trivial, find the LCS (Longest Common Subsequence)
  let trimmed1 = array1.slice(commonHead, len1 - commonTail);
  let trimmed2 = array2.slice(commonHead, len2 - commonTail);
  let seq = lcs.get(trimmed1, trimmed2, matchItems, matchContext);
  let removedItems = [];
  result = result || {
    _t: 'a',
  };
  for (index = commonHead; index < len1 - commonTail; index++) {
    if (arrayIndexOf(seq.indices1, index - commonHead) < 0) {
      // removed
      result[`_${index}`] = [array1[index], 0, 0];
      removedItems.push(index);
    }
  }

  let detectMove = true;
  if (
    context.options &&
    context.options.arrays &&
    context.options.arrays.detectMove === false
  ) {
    detectMove = false;
  }
  let includeValueOnMove = false;
  if (
    context.options &&
    context.options.arrays &&
    context.options.arrays.includeValueOnMove
  ) {
    includeValueOnMove = true;
  }

  let removedItemsLength = removedItems.length;
  for (index = commonHead; index < len2 - commonTail; index++) {
    let indexOnArray2 = arrayIndexOf(seq.indices2, index - commonHead);
    if (indexOnArray2 < 0) {
      // added, try to match with a removed item and register as position move
      let isMove = false;
      if (detectMove && removedItemsLength > 0) {
        for (
          let removeItemIndex1 = 0;
          removeItemIndex1 < removedItemsLength;
          removeItemIndex1++
        ) {
          index1 = removedItems[removeItemIndex1];
          if (
            matchItems(
              trimmed1,
              trimmed2,
              index1 - commonHead,
              index - commonHead,
              matchContext
            )
          ) {
            // store position move as: [originalValue, newPosition, ARRAY_MOVE]
            result[`_${index1}`].splice(1, 2, index, ARRAY_MOVE);
            if (!includeValueOnMove) {
              // don't include moved value on diff, to save bytes
              result[`_${index1}`][0] = '';
            }

            index2 = index;
            child = new DiffContext(
              context.left[index1],
              context.right[index2]
            );
            context.push(child, index2);
            removedItems.splice(removeItemIndex1, 1);
            isMove = true;
            break;
          }
        }
      }
      if (!isMove) {
        // added
        result[index] = [array2[index]];
      }
    } else {
      // match, do inner diff
      index1 = seq.indices1[indexOnArray2] + commonHead;
      index2 = seq.indices2[indexOnArray2] + commonHead;
      child = new DiffContext(context.left[index1], context.right[index2]);
      context.push(child, index2);
    }
  }

  context.setResult(result).exit();
};
diffFilter.filterName = 'arrays';

