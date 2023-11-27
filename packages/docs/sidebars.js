/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
    Development: [
        {
            type: 'category',
            label: 'Getting Started',
            items: [
                'dev/intro/overview',
                'dev/intro/installation',
                'dev/intro/server-configuration',
            ],
        },
        {
            type: 'category',
            label: 'Framework',
            items: [
                'dev/framework/modules',
                'dev/framework/models',
                'dev/framework/endpoints',
                'dev/framework/content',
            ],
        },
        {
            type: 'category',
            label: 'UI',
            items: [
                'dev/ui/styles',
            ],
        },
    ],
};

module.exports = sidebars;
