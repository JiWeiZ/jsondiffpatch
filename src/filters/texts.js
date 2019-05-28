/* global diff_match_patch */
import dmp from 'diff-match-patch';

let TEXT_DIFF = 2;
let DEFAULT_MIN_LENGTH = 60;
let cachedDiffPatch = null;

let getDiffMatchPatch = function(required) {
  /* jshint camelcase: false */

  if (!cachedDiffPatch) {
    let instance;
    /* eslint-disable camelcase, new-cap */
    if (typeof diff_match_patch !== 'undefined') {
      // already loaded, probably a browser
      instance =
        typeof diff_match_patch === 'function'
          ? new diff_match_patch()
          : new diff_match_patch.diff_match_patch();
    } else if (dmp) {
      try {
        instance = dmp && new dmp();
      } catch (err) {
        instance = null;
      }
    }
    /* eslint-enable camelcase, new-cap */
    if (!instance) {
      if (!required) {
        return null;
      }
      let error = new Error('text diff_match_patch library not found');
      // eslint-disable-next-line camelcase
      error.diff_match_patch_not_found = true;
      throw error;
    }
    cachedDiffPatch = {
      diff: function(txt1, txt2) {
        return instance.patch_toText(instance.patch_make(txt1, txt2));
      }
    };
  }
  return cachedDiffPatch;
};

export const diffFilter = function textsDiffFilter(context) {
  if (context.leftType !== 'string') {
    return;
  }
  let minLength =
    (context.options &&
      context.options.textDiff &&
      context.options.textDiff.minLength) ||
    DEFAULT_MIN_LENGTH;
  if (context.left.length < minLength || context.right.length < minLength) {
    context.setResult([context.left, context.right]).exit();
    return;
  }
  // large text, try to use a text-diff algorithm
  let diffMatchPatch = getDiffMatchPatch();
  if (!diffMatchPatch) {
    // diff-match-patch library not available,
    // fallback to regular string replace
    context.setResult([context.left, context.right]).exit();
    return;
  }
  let diff = diffMatchPatch.diff;
  context.setResult([diff(context.left, context.right), 0, TEXT_DIFF]).exit();
};
diffFilter.filterName = 'texts';
