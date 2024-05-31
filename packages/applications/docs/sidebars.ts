/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check
import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars: SidebarsConfig = {
    Administration: [
        'admin/intro/installation',
        'admin/intro/server-configuration',
    ],
    Development: [
        'dev/intro/overview',
        'dev/intro/qa',
        {
            type: 'category',
            label: 'Framework',
            items: [
                'dev/framework/modules',
                'dev/framework/models',
                'dev/framework/endpoints',
                'dev/framework/acl',
                'dev/framework/permissions',
                'dev/framework/policies',
                'dev/framework/features',
                'dev/framework/content',
                'dev/framework/migrations',
                'dev/framework/storage',
            ],
        },
        {
            type: 'category',
            label: 'UI',
            items: [
                'dev/ui/styles',
                'dev/ui/menus',
                'dev/ui/icons',
            ],
        },
    ],
};

module.exports = sidebars;
