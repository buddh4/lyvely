declare module '*.vue';

import 'vue'
declare module 'vue' {
    function mergeDefaults(...args: any[]): any;
}