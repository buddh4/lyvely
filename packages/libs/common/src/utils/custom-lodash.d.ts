import type { cloneDeep, merge, uniqueId, cloneDeepWith, escapeRegExp, isEqual, CloneDeepWithCustomizer } from 'lodash-es';

declare module './custom-lodash' {
  export default {
    cloneDeep,
    cloneDeepWith,
    merge,
    uniqueId,
    escapeRegExp,
    isEqual,
    CloneDeepWithCustomizer
  };
}
